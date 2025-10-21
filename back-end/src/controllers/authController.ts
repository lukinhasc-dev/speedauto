import { Request, Response } from 'express';
import { getUserByEmail } from '../models/User';
import bcrypt from 'bcrypt';

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  const user = await getUserByEmail(email);

  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(senha, user.senha);
  if (!valid) return res.status(401).json({ message: 'Senha incorreta' });

  // aqui você pode gerar JWT se quiser
  res.json({ message: 'Login ok', email: user.email });
}


