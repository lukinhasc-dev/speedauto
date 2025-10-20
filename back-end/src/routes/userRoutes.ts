import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/User';
import bcrypt from 'bcrypt';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';


// Registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const newUser = await createUser(email, senha);
    res.status(201).json({ id: newUser.id, email: newUser.email });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });

    const valid = await bcrypt.compare(senha, user.senha);
    if (!valid) return res.status(401).json({ error: 'Senha inválida' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, email: user.email });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;