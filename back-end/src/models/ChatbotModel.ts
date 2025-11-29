import { supabase } from "../db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveMemory, loadMemory } from "../memory/memory";
import { parseIntent, handleIntent } from "./intent";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.0-flash";

const SYSTEM_PROMPT = `
Você é a SpeedAuto AI, assistente virtual exclusivo do SpeedAuto.

**REGRAS IMPORTANTES:**
1. Responda SOMENTE sobre funcionalidades do sistema SpeedAuto (veículos, clientes, leads, vendas, dashboard).
2. Se o usuário perguntar algo fora do escopo (receitas, piadas, assuntos gerais), responda: "Desculpe, sou especializado apenas no sistema SpeedAuto. Posso ajudar com veículos, clientes, leads ou dados do sistema."
3. SEMPRE priorize dados reais do sistema (RAG) quando disponíveis.
4. Respostas devem ser compactas, objetivas e profissionais.
5. Use um tom educado e prestativo.
6. Se não souber uma informação do sistema, sugira que o usuário consulte o administrador ou verifique os dados diretamente.

**NUNCA:**
- Responda sobre assuntos fora do domínio automotivo/sistema SpeedAuto
- Crie informações falsas sobre veículos ou clientes
- Execute ações fora do escopo (agendamentos externos, recomendações pessoais, etc.)
`;





async function rag_countVehicles(msg: string) {
    if (!/quantos|qtd|total/.test(msg)) return null;
    if (!/carro|veículo|veiculos|estoque/.test(msg)) return null;

    const { count, error } = await supabase
        .from("veiculos")
        .select("*", { count: "exact", head: true });

    if (error) throw error;

    return `Atualmente há ${count ?? 0} veículos cadastrados.`;
}

async function rag_listVehicles(msg: string, sessionId?: string) {
    if (!/listar|mostrar|ver|quais/.test(msg)) return null;
    if (!/carro|veículo|veiculos|estoque/.test(msg)) return null;

    let query = supabase.from("veiculos").select("id, marca, modelo, status, cor");

    if (/disponível/.test(msg)) query.eq("status", "Disponível");
    if (/vendido/.test(msg)) query.eq("status", "Vendido");
    if (/manutenção/.test(msg)) query.eq("status", "Em Manutenção");

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return "Nenhum veículo encontrado.";

    if (sessionId && data[0]?.id) {
        await saveMemory(sessionId, "last_vehicle_id", String(data[0].id));
    }

    const list = data.map((v: any) =>
        `• ${v.marca} ${v.modelo} — ${v.status}`
    ).join("\n");

    return `Aqui está a lista de veículos:\n\n${list}`;
}

async function rag_countLeads(msg: string) {
    if (!/lead|cliente/.test(msg)) return null;
    if (!/quantos|total|qtd|temos/.test(msg)) return null;

    const { count, error } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .eq("status", "Lead");

    if (error) throw error;

    return `Atualmente há ${count ?? 0} leads ativos.`;
}

async function rag_listLeads(msg: string, sessionId?: string) {
    if (!/lead|cliente/.test(msg)) return null;
    if (!/listar|mostrar|ver|quais/.test(msg)) return null;

    const { data, error } = await supabase
        .from("clientes")
        .select("id, nome, telefone, email, origem, status")
        .eq("status", "Lead");

    if (error) throw error;
    if (!data || data.length === 0) return "Nenhum lead encontrado.";

    if (sessionId && data[0]?.id) {
        await saveMemory(sessionId, "last_lead_id", String(data[0].id));
    }

    const list = data
        .map((l: any) =>
            `• ${l.nome} — ${l.telefone ?? "sem telefone"} — ${l.origem ?? "origem não informada"}`
        )
        .join("\n");

    return `Aqui estão os leads:\n\n${list}`;
}

async function rag_classifyVehicles(msg: string) {
    if (!/classificar|separar|categorizar|diferenciar/.test(msg)) return null;
    if (!/carro|moto|veículo/.test(msg)) return null;

    const { data: vehicles, error } = await supabase
        .from("veiculos")
        .select("marca, modelo")
        .limit(50);

    if (error) throw error;
    if (!vehicles || vehicles.length === 0) return "Nenhum veículo para classificar.";

    const list = vehicles.map((v: any) => `${v.marca} ${v.modelo}`).join(", ");

    const prompt = `Classifique em Carro, Moto ou Outro. Resposta curta. Lista: ${list}`;

    const model = client.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent(prompt);

    return result.response.text();
}

const ragChecks = [
    rag_countVehicles,
    rag_listVehicles,
    rag_countLeads,
    rag_listLeads,
    rag_classifyVehicles,
];

async function runRAG(msg: string, sessionId?: string) {
    for (const c of ragChecks) {
        const out = await c(msg, sessionId);
        if (out) return out;
    }
    return null;
}

// --------------------------------------------------
// LLM PRINCIPAL
// --------------------------------------------------

export async function getAIResponse(message: string, sessionId?: string) {
    const msg = message.toLowerCase();

    try {
        // 1️⃣ - RAG
        const rag = await runRAG(msg, sessionId);
        if (rag) return rag;

        // 2️⃣ - INTENTS + MEMÓRIA
        const intent = await parseIntent(message);

        if (intent.confidence >= 0.6) {
            const handled = await handleIntent(intent, sessionId);
            if (handled?.text) return handled.text;
        }

        // 3️⃣ - CARREGAR MEMÓRIA DA SESSÃO → usar no prompt
        const lastVehicle = await loadMemory(sessionId!, "last_vehicle_id");
        const lastLead = await loadMemory(sessionId!, "last_lead_id");

        let memoryContext = "";
        if (lastVehicle) memoryContext += `Último veículo consultado: ${lastVehicle}\n`;
        if (lastLead) memoryContext += `Último lead consultado: ${lastLead}\n`;

        const prompt = `
${SYSTEM_PROMPT}
Memória do usuário:
${memoryContext || "Nenhuma memória relevante."}

Usuário: ${message}
Responda curto e direto.
`;

        // 4️⃣ - RESPOSTA LLM (fallback final)
        const model = client.getGenerativeModel({ model: MODEL_NAME });
        const llm = await model.generateContent(prompt);

        return llm.response.text();

    } catch (err) {
        console.error("AI Error", err);
        return "Ocorreu um erro ao processar sua solicitação.";
    }
}
