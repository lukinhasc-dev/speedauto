import { supabase } from '../db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  senha: string;
  nome: string;
  telefone: string;
}

export async function createUser(email: string, senha: string, nome: string, telefone: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ nome, email, senha: hashedPassword, telefone})
    .select()
    .single();
  if (error) throw error;
  return data as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error) throw error;
  return data as User;
}


export async function getUserById(id: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as User;
}
