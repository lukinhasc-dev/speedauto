import { supabase } from "../db";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseIntent, handleIntent, type IntentResult } from "./intent";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL_NAME = "gemini-2.0-flash";

const SYSTEM_PROMPT = `
Você é a SpeedAuto AI, assistente virtual do SaaS SpeedAuto.
Responda de forma breve, amigável e profissional. Nunca use markdown.
`;


async function rag_countAvailableVehicles(lowerMsg: string): Promise<string | null> {
    if (lowerMsg.includes("veículo") && (lowerMsg.includes("disponível") || lowerMsg.includes("estoque"))) {
        const { count, error } = await supabase.from("veiculos").select("*", { count: "exact", head: true }).eq("status", "Disponível");
        if (error) throw error;
        return `No momento, temos ${count ?? 0} veículos disponíveis no estoque.`;
    }
    return null;
}

async function rag_countActiveLeads(lowerMsg: string): Promise<string | null> {
    if ((lowerMsg.includes("cliente") || lowerMsg.includes("lead")) && (lowerMsg.includes("quantos") || lowerMsg.includes("temos"))) {
        const { count, error } = await supabase.from("clientes").select("*", { count: "exact", head: true }).eq("status", "Lead");
        if (error) throw error;
        return `Atualmente, existem ${count ?? 0} leads ativos no CRM.`;
    }
    return null;
}

async function rag_listVehicles(lowerMsg: string): Promise<string | null> {
    if ((lowerMsg.includes("listar") || lowerMsg.includes("ver") || lowerMsg.includes("quais")) && (lowerMsg.includes("veículo") || lowerMsg.includes("carro"))) {
        let query = supabase.from("veiculos").select("marca, modelo, status").limit(5);
        if (lowerMsg.includes("disponível")) query = query.eq("status", "Disponível");
        if (lowerMsg.includes("vendido")) query = query.eq("status", "Vendido");
        if (lowerMsg.includes("manutenção")) query = query.eq("status", "Em Manutenção");
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) return "Não encontrei veículos no sistema que correspondam a essa busca.";
        const vehicleList = data.map((v: any) => `- ${v.marca} ${v.modelo} (Status: ${v.status})`).join("\n");
        return `Encontrei ${data.length} veículos recentes:\n${vehicleList}`;
    }
    return null;
}

const ragChecks = [rag_countAvailableVehicles, rag_countActiveLeads, rag_listVehicles];

async function runRAGChecks(lowerMsg: string): Promise<string | null> {
    for (const check of ragChecks) {
        const r = await check(lowerMsg);
        if (r) return r;
    }
    return null;
}


export async function getAIResponse(message: string, confirmationAnswer?: string): Promise<string> {
    const lowerMsg = message.toLowerCase();

    try {
        const rag = await runRAGChecks(lowerMsg);
        if (rag) return rag;

        if (confirmationAnswer) {
            const ans = confirmationAnswer.trim().toLowerCase();
            if (ans === "sim" || ans === "s" || ans === "yes") {
                if (confirmationAnswer.startsWith("CONFIRM|")) {
                    const payload = confirmationAnswer.replace(/^CONFIRM\|/, "");
                    try {
                        const meta = JSON.parse(payload);
                        if (meta.action === "REGISTER_SALE") {
                            const { veiculo_id, sale_amount, sale_date } = meta;
                            const payloadSale: any = {
                                veiculo_id,
                                valor: sale_amount ?? null,
                                data_venda: sale_date ?? new Date().toISOString(),
                                criado_em: new Date().toISOString(),
                            };
                            const { data, error } = await supabase.from("vendas").insert(payloadSale).select().single();
                            if (error) throw error;
                            await supabase.from("veiculos").update({ status: "Vendido" }).eq("id", veiculo_id);
                            return `Venda registrada (id: ${data.id}) para veículo ${veiculo_id}.`;
                        }
                    } catch (err) {
                        console.error("Erro em fluxo de confirmação:", err);
                    }
                }
            } else {
                return "Ok, operação cancelada.";
            }
        }

        const intentRes = await parseIntent(message);

        if (intentRes.confidence >= 0.6) {
            const handled = await handleIntent(intentRes);
            if (handled) {
                if (handled.type === "ok") return handled.text;
                if (handled.type === "confirm") {
                    const meta = handled.meta || {};
                    return `${handled.text}\n\nSe quiser confirmar, responda "SIM".`;
                }
            }
        }

        const model = client.getGenerativeModel({
            model: MODEL_NAME,
        });

        const llmResp = await model.generateContent(
            SYSTEM_PROMPT + "\n\nUsuário: " + message
        );

        return llmResp.response.text();
    } catch (err: any) {
        console.error("Erro no ChatbotModel:", err);
        if (err.status === 404) return "Erro: modelo não encontrado. Verifique a configuração da API.";
        if (err.status === 429) return "Muitas solicitações no momento. Tente novamente em alguns segundos.";
        return "Ocorreu um erro ao processar sua solicitação.";
    }
}
