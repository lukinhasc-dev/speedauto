import { supabase } from '../db';

export type StatusVendas = 'Em Andamento' | 'Concluída' | 'Cancelada';

export interface Vendas {
    id: number;
    veiculo: string;
    cliente: string;
    data: string;
    valor: number;
    status: StatusVendas;
}

export async function getVendas(): Promise<Vendas[]> {
  const { data, error } = await supabase.from('vendas').select('*');
  if (error) throw error;
  return data as Vendas[];
}

export async function getVendaById(id: number): Promise<Vendas | null> {
  const { data, error } = await supabase.from('vendas').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Vendas;
}

export async function addVenda(venda: Omit<Vendas, 'id'>): Promise<Vendas> {
  const { data, error } = await supabase.from('vendas').insert(venda).select().single();
  if (error) throw error;
  return data as Vendas;
}

export async function updateVenda(id: number, venda: Partial<Vendas>): Promise<Vendas> {
  const { data, error } = await supabase.from('vendas').update(venda).eq('id', id).select().single();
  if (error) throw error;
  return data as Vendas;
}

export async function deleteVenda(id: number): Promise<void> {
  const { error } = await supabase.from('vendas').delete().eq('id', id);
  if (error) throw error;
}