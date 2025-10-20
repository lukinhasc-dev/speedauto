import axios from 'axios';
import type { User } from '../types/Users';

const API_URL = 'http://localhost:3000/users';

// Função para login do usuário
export const login = async (email: string, senha: string): Promise<{ token: string; email: string }> => {
  const response = await axios.post(`${API_URL}/login`, { email, senha });
  return response.data;
}

// Função para registro do usuário
export const register = async (email: string, senha: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/register`, { email, senha });
  return response.data;
}

