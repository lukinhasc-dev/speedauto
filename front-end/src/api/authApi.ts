// src/api/authApi.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('VITE_API_URL is not defined in .env file!');
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nome: string;
    telefone: string;
    foto: string | null;
  };
}

export interface UserResponse {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

// Função de login
export const login = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
  return response.data;
};

export const register = async (nome: string, email: string, senha: string, telefone: string): Promise<UserResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, { nome, email, senha, telefone });
  return response.data;
}

// Função para atualizar a foto do usuário
export const updatePhoto = async (userId: number, fotoUrl: string): Promise<{ message: string; foto: string }> => {
  const response = await axios.put(`${API_URL}/auth/update-photo`, { userId, fotoUrl });
  return response.data;
};

// Função para atualizar a senha do usuário
export const updatePassword = async (userId: number, senhaAtual: string, novaSenha: string): Promise<{ message: string }> => {
  const response = await axios.post(`${API_URL}/auth/atualiza-senha`, { userId, senhaAtual, novaSenha });
  return response.data;
};

