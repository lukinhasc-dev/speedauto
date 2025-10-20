import { supabase } from '../db';


export type StatusVeiculo = 'Disponível' | 'Vendido' | 'Em manutenção';

export interface Veiculos {
    id: number;
    marca: string;
    modelo: string;
    ano:number;
    cor: string;
    combustivel: string;
    placa: string;
    valor_venda: number;
    disponivel: StatusVeiculo;
}


// Funções CRUD
export async function getVeiculos(): Promise<Veiculos[]> {
  const { data, error } = await supabase.from('veiculos').select('*');
  if (error) throw error;
  return data as Veiculos[];
}

export async function getVeiculoById(id: number): Promise<Veiculos | null> {
  const { data, error } = await supabase.from('veiculos').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Veiculos;
}

export async function addVeiculo(veiculo: Omit<Veiculos, 'id'>): Promise<Veiculos> {
  const { data, error } = await supabase.from('veiculos').insert(veiculo).select().single();
  if (error) throw error;
  return data as Veiculos;
}

export async function updateVeiculo(id: number, veiculo: Partial<Veiculos>): Promise<Veiculos> {
  const { data, error } = await supabase.from('veiculos').update(veiculo).eq('id', id).select().single();
  if (error) throw error;
  return data as Veiculos;
}

export async function deleteVeiculo(id: number): Promise<void> {
  const { error } = await supabase.from('veiculos').delete().eq('id', id);
  if (error) throw error;
}
