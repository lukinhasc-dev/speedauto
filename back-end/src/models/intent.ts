// src/models/intent.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../db";
import { loadMemory } from "../memory/memory";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const INTENT_MODEL = "gemini-2.0-flash";
const model = client.getGenerativeModel({ model: INTENT_MODEL });

/* tipos */
export type IntentName =
    | "COUNT_VEHICLES"
    | "LIST_VEHICLES"
    | "COUNT_LEADS"
    | "LIST_LEADS"
    | "CREATE_CLIENT"
    | "REGISTER_SALE"
    | "NAVIGATE"
    | "SMALLTALK"
    | "UNKNOWN";

export interface IntentResult {
    intent: IntentName;
    confidence: number;
    entities: Record<string, any>;
}

/* prompt estruturado — mais robusto, pede JSON estrito */
function buildIntentPrompt(userMessage: string) {
    return `
SYSTEM: Você é um analisador de intenções curado para o SaaS SpeedAuto.
REGRAS:
- Retorne SOMENTE JSON válido, sem texto adicional.
- Formato exato: {"intent":"X","confidence":0.0,"entities":{...}}
- Intents válidas: ${[
            "COUNT_VEHICLES",
            "LIST_VEHICLES",
            "COUNT_LEADS",
            "LIST_LEADS",
            "CREATE_CLIENT",
            "REGISTER_SALE",
            "NAVIGATE",
            "SMALLTALK",
            "UNKNOWN",
        ].join(", ")}
- Se a intenção for NAVIGATE, use entities.path como string (ex: \"/clientes\").
- Para criação/registro extraia: client_name, client_email, client_phone, vehicle_id, sale_amount, sale_date.
- Para listagens extraia: marca, modelo, status, limit (limit deve ser número).
- Se você não tiver certeza, use intent = \"UNKNOWN\" com confidence < 0.6.
USER: "${userMessage.replace(/"/g, '\\"')}"
`.trim();
}

/* chama Gemini — tenta parse seguro */
export async function parseIntent(userMessage: string): Promise<IntentResult> {
    try {
        const prompt = buildIntentPrompt(userMessage);
        const result = await model.generateContent(prompt);
        const raw = result.response.text();

        // Extrai primeiro JSON encontrado
        const matched = raw.match(/\{[\s\S]*\}/);
        if (!matched) {
            return { intent: "UNKNOWN", confidence: 0, entities: {} };
        }

        const parsed = JSON.parse(matched[0]);

        return {
            intent: (parsed.intent as IntentName) ?? "UNKNOWN",
            confidence: Number(parsed.confidence ?? 0),
            entities: parsed.entities ?? {},
        };
    } catch (err) {
        console.error("parseIntent JSON error:", err);
        return { intent: "UNKNOWN", confidence: 0, entities: {} };
    }
}

/* retunos possíveis */
type HandleResult =
    | { type: "ok"; text: string }
    | { type: "confirm"; text: string; meta?: any }
    | null;

/* validações utilitárias */
function isValidEmail(e?: string) {
    return !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function isValidPhone(p?: string) {
    return !!p && /\d{6,15}/.test((p ?? "").replace(/\D/g, ""));
}
function toNumber(v: any) {
    if (v == null) return null;
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : null;
}

/* handleIntent agora aceita sessionId para usar memória */
export async function handleIntent(intentResult: IntentResult, sessionId?: string): Promise<HandleResult> {
    const { intent, entities } = intentResult;

    /* COUNT VEHICLES */
    async function countVehicles(status?: string) {
        const q = supabase.from("veiculos").select("*", { count: "exact", head: true });
        if (status) q.eq("status", status);
        const { count, error } = await q;
        if (error) throw error;
        return `Temos ${count ?? 0} veículos${status ? ` com status ${status}` : ""}.`;
    }

    /* LIST VEHICLES (resposta curta) */
    async function listVehicles(filters: Record<string, any>) {
        const limit = filters?.limit ? Number(filters.limit) : 10;
        let q = supabase.from("veiculos").select("id,marca,modelo,ano,status").limit(limit);

        if (filters?.status) q.eq("status", String(filters.status));
        if (filters?.marca) q.ilike("marca", `%${String(filters.marca)}%`);
        if (filters?.modelo) q.ilike("modelo", `%${String(filters.modelo)}%`);

        const { data, error } = await q;
        if (error) throw error;
        if (!data || data.length === 0) return "Nenhum veículo encontrado.";

        // salva última referência no suposto fluxo (se sessionId disponível)
        if (sessionId && data[0]?.id) {
            try {
                await supabase.from("chat_memory").upsert([{ session_id: sessionId, key: "last_vehicle_id", value: String(data[0].id), updated_at: new Date().toISOString() }, { onConflict: ["session_id", "key"] }]);
            } catch (e) { /* ignore */ }
        }

        return `Encontrei ${data.length} veículos: ` + data.map((v: any) => `- ${v.marca} ${v.modelo} (${v.ano}) [${v.status}]`).join("\n");
    }

    /* COUNT LEADS */
    async function countLeads() {
        const { count, error } = await supabase.from("clientes").select("*", { count: "exact", head: true }).eq("status", "Lead");
        if (error) throw error;
        return `Existem ${count ?? 0} leads.`;
    }

    /* LIST LEADS — agora REAL: usa paginação simples e filtros */
    async function listLeads(filters: Record<string, any>) {
        const limit = filters?.limit ? Number(filters.limit) : 20;
        let q = supabase.from("clientes").select("id,nome,telefone,email,origem,status").limit(limit);

        if (filters?.origem) q.ilike("origem", `%${String(filters.origem)}%`);
        if (filters?.nome) q.ilike("nome", `%${String(filters.nome)}%`);

        const { data, error } = await q;
        if (error) throw error;
        if (!data || data.length === 0) return "Nenhum lead encontrado.";

        if (sessionId && data[0]?.id) {
            try {
                await supabase.from("chat_memory").upsert([{ session_id: sessionId, key: "last_lead_id", value: String(data[0].id), updated_at: new Date().toISOString() }, { onConflict: ["session_id", "key"] }]);
            } catch (e) { }
        }

        return `Leads (${data.length}):\n` + data.map((l: any) => `- ${l.nome} — ${l.telefone ?? "sem telefone"} — ${l.origem ?? "origem não informada"}`).join("\n");
    }

    /* CREATE CLIENT */
    async function createClient(ents: any): Promise<HandleResult> {
        const nome = ents?.client_name ? String(ents.client_name) : "Cliente";
        const email = ents?.client_email ? String(ents.client_email) : null;
        const telefone = ents?.client_phone ? String(ents.client_phone) : null;

        if (email && !isValidEmail(email)) return { type: "ok", text: "E-mail inválido." };

        const payload = { nome, email, telefone, status: "Lead", created_at: new Date().toISOString() };
        const { data, error } = await supabase.from("clientes").insert(payload).select().single();
        if (error) {
            console.error("createClient error:", error);
            return { type: "ok", text: "Erro ao criar cliente." };
        }
        return { type: "ok", text: `Cliente ${data.nome} criado (id: ${data.id}).` };
    }

    /* REGISTER SALE (melhor verificação e confirm) */
    async function registerSale(ents: any): Promise<HandleResult> {
        const vehicle_id = ents?.vehicle_id ?? ents?.veiculo_id ?? null;
        const sale_amount = toNumber(ents?.sale_amount ?? ents?.valor);
        const sale_date = ents?.sale_date ?? new Date().toISOString();

        if (!vehicle_id) {
            // tenta recuperar do contexto (memória)
            if (sessionId) {
                const lastVehicle = await loadMemory(sessionId, "last_vehicle_id");
                if (lastVehicle) {
                    return { type: "confirm", text: `Confirma venda do veículo ${lastVehicle}? Responda: CONFIRM|${JSON.stringify({ action: "REGISTER_SALE", vehicle_id: lastVehicle, sale_amount: sale_amount ?? null, sale_date })}`, meta: { action: "REGISTER_SALE", vehicle_id: lastVehicle, sale_amount: sale_amount ?? null, sale_date } };
                }
            }
            return { type: "ok", text: "Informe o ID do veículo para registrar a venda." };
        }

        if (!sale_amount) {
            return { type: "confirm", text: `Confirma registrar a venda do veículo ${vehicle_id}? Responda: CONFIRM|${JSON.stringify({ action: "REGISTER_SALE", vehicle_id, sale_amount: null, sale_date })}`, meta: { action: "REGISTER_SALE", vehicle_id, sale_amount: null, sale_date } };
        }

        const payload = { veiculo_id: vehicle_id, valor: sale_amount, data_venda: sale_date, criado_em: new Date().toISOString() };
        const { data, error } = await supabase.from("vendas").insert(payload).select().single();
        if (error) {
            console.error("registerSale error:", error);
            return { type: "ok", text: "Erro ao registrar venda." };
        }
        await supabase.from("veiculos").update({ status: "Vendido" }).eq("id", vehicle_id);

        return { type: "ok", text: `Venda registrada (id: ${data.id}).` };
    }

    /* Dispatcher principal */
    try {
        switch (intent) {
            case "COUNT_VEHICLES":
                return { type: "ok", text: await countVehicles(typeof entities.status === "string" ? entities.status : undefined) };

            case "LIST_VEHICLES":
                return { type: "ok", text: await listVehicles(entities) };

            case "COUNT_LEADS":
                return { type: "ok", text: await countLeads() };

            case "LIST_LEADS":
                return { type: "ok", text: await listLeads(entities) };

            case "CREATE_CLIENT":
                return await createClient(entities);

            case "REGISTER_SALE":
                return await registerSale(entities);

            case "NAVIGATE":
                return { type: "ok", text: `Navegar para ${String(entities.path ?? "/")}` };

            case "SMALLTALK":
            default:
                return null;
        }
    } catch (err: any) {
        console.error("handleIntent error:", err);
        return { type: "ok", text: `Erro ao executar: ${err?.message ?? String(err)}` };
    }
}
