// backend/src/routes/auth.ts
import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const router = Router();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ndnvvuqqfwxexjvylddq.supabase.co/';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbnZ2dXFxZnd4ZXhqdnlsZGRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM2MzY1MywiZXhwIjoyMDc0OTM5NjUzfQ.yl7MLF_3GxY-snXtua8G6wBwk6-BWL_TsD5fY30SK1s';
const supabase = createClient(supabaseUrl, supabaseKey);


router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca usuário pelo email (minúsculo)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // 🔒 Verifica a senha com bcrypt.compare
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Retorna sucesso com dados completos do usuário
    return res.json({
      token: 'fake-jwt-token', // depois a gente implementa JWT de verdade
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        telefone: user.telefone,
        foto: user.foto || null,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// REGISTRO (ADMIN)
router.post('/register', async (req, res) => {
  try {
    const { email, senha, nome, telefone } = req.body;

    if (!email || !senha || !nome || !telefone) {
      return res.status(400).json({ message: 'Email, senha, nome e telefone são obrigatórios' });
    }

    // Verifica se já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Cria o novo usuário
    const { error } = await supabase
      .from('users')
      .insert([{ email: email.toLowerCase(), senha: hashedPassword, nome, telefone }]);

    if (error) throw error;

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});


router.post('/atualiza-senha', async (req, res) => {
  try {
    const { userId, senhaAtual, novaSenha } = req.body;

    if (!userId || !senhaAtual || !novaSenha) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Busca usuário para verificar senha atual
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('senha')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'A senha atual está incorreta' });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Atualiza a senha do usuário
    const { error: updateError } = await supabase
      .from('users')
      .update({ senha: hashedPassword })
      .eq('id', userId);

    if (updateError) throw updateError;

    return res.status(200).json({ message: 'Senha atualizada com sucesso!' });
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
})

router.put('/update-photo', async (req, res) => {
  try {
    const { userId, fotoUrl } = req.body;

    if (userId === undefined || userId === null) {
      return res.status(400).json({ message: 'userId é obrigatório' });
    }

    // Permite fotoUrl vazio para remover a foto
    const photoValue = fotoUrl === '' ? null : fotoUrl;

    // Atualiza a foto do usuário
    const { error } = await supabase
      .from('users')
      .update({ foto: photoValue })
      .eq('id', userId);

    if (error) throw error;

    return res.status(200).json({ message: 'Foto atualizada com sucesso!', foto: photoValue });
  } catch (err) {
    console.error('Erro ao atualizar foto:', err);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

export default router;
