// backend/src/routes/auth.ts
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ndnvvuqqfwxexjvylddq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbnZ2dXFxZnd4ZXhqdnlsZGRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM2MzY1MywiZXhwIjoyMDc0OTM5NjUzfQ.yl7MLF_3GxY-snXtua8G6wBwk6-BWL_TsD5fY30SK1s';
const supabase = createClient(supabaseUrl, supabaseKey);

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca usuário pelo email (normalizando para minúsculo)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verifica senha (removendo espaços extras)
    if (user.senha.trim() !== senha.trim()) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Aqui você pode gerar um JWT se quiser, por enquanto só envia email
    return res.json({
      token: 'fake-jwt-token', // substitua por JWT real se quiser
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
