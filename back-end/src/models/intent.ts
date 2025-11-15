import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../db";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const INTENT_MODEL = "gemini-2.0-flash";
const model = client.getGenerativeModel({ model: INTENT_MODEL });

/*tipos*/
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
    entities: Record<string, string | number | null | undefined>;
}

/*prompt estruturado*/
function buildIntentPrompt(userMessage: string) {
    return `
SYSTEM: Você é um analisador de intenções para o SaaS SpeedAuto.
REGRAS:
- Retorne SOMENTE JSON válido.
- Formato: {"intent":"X","confidence":0.0-1.0,"entities":{...}}
- Intents válidas:
  COUNT_VEHICLES, LIST_VEHICLES, COUNT_LEADS, LIST_LEADS,
  CREATE_CLIENT, REGISTER_SALE, NAVIGATE, SMALLTALK, UNKNOWN
- Para NAVIGATE use entities.path ex: "/clientes"
- Para criação/registro extrair: client_name, client_email, client_phone, vehicle_id, sale_amount, sale_date.
- Para listagens extrair: marca, modelo, status, limit.
- Se dúvida → UNKNOWN com confidence < 0.6
USER: "${userMessage.replace(/"/g, '\\"')}"
`.trim();
}

/*chama Gemini*/
export async function parseIntent(userMessage: string): Promise<IntentResult> {
    try {
        const prompt = buildIntentPrompt(userMessage);
        const result = await model.generateContent(prompt);
        const raw = result.response.text();

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

/*retornos possíveis*/
type HandleResult =
    | { type: "ok"; text: string }
    | { type: "confirm"; text: string; meta?: any }
    | null;

//validações
function isValidEmail(e?: string) {
    return !!e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function isValidPhone(p?: string) {
    return !!p && /\d{6,15}/.test(p.replace(/\D/g, ""));
}
function toNumber(v: any) {
    if (v == null) return null;
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : null;
}

/*despachante*/
export async function handleIntent(intentResult: IntentResult): Promise<HandleResult> {
    const { intent, entities } = intentResult;

    /*COUNT VEHICLES*/
    async function countVehicles(status?: string) {
        const q = supabase.from("veiculos").select("*", { count: "exact", head: true });
        if (status) q.eq("status", status);
        const { count, error } = await q;
        if (error) throw error;

        return `No momento temos ${count ?? 0} veículos${status ? ` com status ${status}` : ""}.`;
    }

    /*LIST VEHICLES*/
    async function listVehicles(filters: Record<string, any>) {
        const limit = filters?.limit ? Number(filters.limit) : 5;
        let q = supabase.from("veiculos").select("id,marca,modelo,ano,status").limit(limit);

        if (filters?.status) q.eq("status", String(filters.status));
        if (filters?.marca) q.ilike("marca", `%${String(filters.marca)}%`);
        if (filters?.modelo) q.ilike("modelo", `%${String(filters.modelo)}%`);

        const { data, error } = await q;
        if (error) throw error;
        if (!data || data.length === 0) return "Nenhum veículo encontrado.";

        return (
            `Encontrei ${data.length} veículos:\n` +
            data.map((v: any) => `- ${v.marca} ${v.modelo} (${v.ano}) [${v.status}]`).join("\n")
        );
    }

    /*COUNT LEADS*/
    async function countLeads() {
        const { count, error } = await supabase
            .from("clientes")
            .select("*", { count: "exact", head: true })
            .eq("status", "Lead");
        if (error) throw error;

        return `Atualmente existem ${count ?? 0} leads.`;
    }

    /*CREATE CLIENT*/
    async function createClient(ents: any): Promise<HandleResult> {
        const nome = ents?.client_name ? String(ents.client_name) : "Cliente";
        const email = ents?.client_email ? String(ents.client_email) : null;
        const telefone = ents?.client_phone ? String(ents.client_phone) : null;

        if (email && !isValidEmail(email)) {
            return { type: "ok", text: "O e-mail fornecido é inválido. Por favor, verifique." } as const;
        }

        const payload = {
            nome,
            email,
            telefone,
            status: "Lead",
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from("clientes").insert(payload).select().single();
        if (error) {
            console.error("createClient error:", error);
            return { type: "ok", text: "Erro ao criar cliente." } as const;
        }

        return { type: "ok", text: `Cliente ${data.nome} criado com sucesso (id: ${data.id}).` } as const;
    }

    /*REGISTER SALE*/
    async function registerSale(ents: any): Promise<HandleResult> {
        const vehicle_id = ents?.vehicle_id ?? ents?.veiculo_id ?? null;
        const sale_amount = toNumber(ents?.sale_amount ?? ents?.valor);
        const sale_date = ents?.sale_date ?? new Date().toISOString();

        if (!vehicle_id) {
            return { type: "ok", text: "Por favor, informe o ID do veículo para registrar a venda." } as const;
        }

        if (!sale_amount) {
            return {
                type: "confirm",
                text: `Confirma registrar a venda do veículo ${vehicle_id}? Responda "SIM".`,
                meta: { action: "REGISTER_SALE", vehicle_id, sale_amount: null, sale_date },
            } as const;
        }

        const payload = {
            veiculo_id: vehicle_id,
            valor: sale_amount,
            data_venda: sale_date,
            criado_em: new Date().toISOString(),
        };

        const { data, error } = await supabase.from("vendas").insert(payload).select().single();
        if (error) {
            console.error("registerSale error:", error);
            return { type: "ok", text: "Erro ao registrar venda." } as const;
        }

        await supabase.from("veiculos").update({ status: "Vendido" }).eq("id", vehicle_id);

        return { type: "ok", text: `Venda registrada (id: ${data.id}) para veículo ${vehicle_id}.` } as const;
    }

    /*Dispatcher principal*/
    try {
        switch (intent) {
            case "COUNT_VEHICLES":
                return {
                    type: "ok",
                    text: await countVehicles(typeof entities.status === "string" ? entities.status : undefined),
                };

            case "LIST_VEHICLES":
                return { type: "ok", text: await listVehicles(entities) };

            case "COUNT_LEADS":
                return { type: "ok", text: await countLeads() };

            case "LIST_LEADS":
                return { type: "ok", text: "Funcionalidade de listagem de leads em desenvolvimento." } as const;

            case "CREATE_CLIENT":
                return await createClient(entities);

            case "REGISTER_SALE":
                return await registerSale(entities);

            case "NAVIGATE":
                return { type: "ok", text: `Navegar para ${String(entities.path ?? "/")}` } as const;

            case "SMALLTALK":
            default:
                return null;
        }
    } catch (err: any) {
        console.error("handleIntent error:", err);
        return { type: "ok", text: `Erro ao executar: ${err?.message ?? String(err)}` } as const;
    }
}
