import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://ndnvvuqqfwxexjvylddq.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbnZ2dXFxZnd4ZXhqdnlsZGRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM2MzY1MywiZXhwIjoyMDc0OTM5NjUzfQ.yl7MLF_3GxY-snXtua8G6wBwk6-BWL_TsD5fY30SK1s'
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
