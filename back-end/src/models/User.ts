import { supabase } from '../db';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  senha: string;
}

export async function createUser(email: string, senha: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(senha, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ email, senha: hashedPassword })
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

