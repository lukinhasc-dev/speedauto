export interface MemoryRecord {
    id?: number;
    session_id: string;
    key: string;
    value: string;
    embedding?: number[];
    created_at?: string;
}
