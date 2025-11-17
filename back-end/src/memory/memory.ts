import { supabase } from "../db";
import { embedText } from "./embedding";
import { MemoryRecord } from "./memoryTypes";

// -------------------------------
// Salvar memória
// -------------------------------
export async function saveMemory(
    sessionId: string,
    key: string,
    value: string
) {
    const embedding = await embedText(value);

    const { error } = await supabase
        .from("memory")
        .insert({
            session_id: sessionId,
            key,
            value,
            embedding
        });

    if (error) {
        console.error("Erro ao salvar memória:", error);
        throw error;
    }
}

// -------------------------------
// Carregar memória pelo key
// -------------------------------
export async function loadMemory(sessionId: string, key: string) {
    const { data, error } = await supabase
        .from("memory")
        .select("value")
        .eq("session_id", sessionId)
        .eq("key", key)
        .order("id", { ascending: false })
        .limit(1)
        .single();

    if (error) return null;

    return data?.value ?? null;
}

// -------------------------------
// Memória Semântica (busca por embedding)
// -------------------------------
export async function searchMemory(sessionId: string, query: string) {
    const queryEmbedding = await embedText(query);

    const { data, error } = await supabase.rpc("match_memory", {
        query_embedding: queryEmbedding,
        filter_session_id: sessionId,
        match_threshold: 0.75,
        match_count: 5
    });

    if (error) {
        console.error("Erro ao buscar memória semântica:", error);
        return [];
    }

    return data;
}
