// src/api/authApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/login'; // ou onde seu backend está rodando

export interface LoginResponse {
  token: string;
  email: string;
}

export interface UserResponse {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

// Função de login
export const login = async (email: string, senha: string): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, { email, senha });
  return response.data;
};

export const register = async(nome: string, email: string, senha: string, telefone: string): Promise<UserResponse> => { 
  const response = await axios.post(`${API_URL}/register`, { nome, email, senha, telefone});
  return response.data;
}

