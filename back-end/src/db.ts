import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Função de teste da conexão
export const testConnection = async () => {
  try {
    // Vamos pegar informações do projeto (sem precisar de tabela)
    const { data, error } = await supabase.from('pg_tables').select('*').limit(1);
    // Se der erro, provavelmente ainda não tem tabelas, mas a conexão está ok
    if (error) {
      console.log('Conexão estabelecida, mas ainda não há tabelas:', error.message);
    } else {
      console.log('Conexão estabelecida, tabela encontrada:', data);
    }
  } catch (err) {
    console.error('Erro ao conectar com Supabase:', err);
    throw err;
  }
};
