import { supabase } from "../db";

export type StatusCliente = 'Lead' | 'Cliente Ativo' | 'Inativo';

export interface Clientes {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    status: StatusCliente;
}

// Funções CRUD
export async function getClientes(): Promise<Clientes[]> {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) throw error;
    return data as Clientes[];
}

export async function getClienteById(id: number): Promise<Clientes | null> {
    const { data, error } = await supabase.from('clientes').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Clientes;
}

export async function addCliente(cliente: Omit<Clientes, 'id'>): Promise<Clientes> {
    const { data, error } = await supabase.from('clientes').insert(cliente).select().single();
    if (error) throw error;
    return data as Clientes;
}

export async function updateCliente(id: number, cliente: Partial<Clientes>): Promise<Clientes> {
    const { data, error } = await supabase.from('clientes').update(cliente).eq('id', id).select().single();
    if (error) throw error;
    return data as Clientes;
}

export async function deleteCliente(id: number): Promise<void> {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) throw error;
}

