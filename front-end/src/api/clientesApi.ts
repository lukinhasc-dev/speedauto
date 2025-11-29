import axios from 'axios';
import type { Clientes } from '../types/Cliente';

const API_URL = import.meta.env.VITE_API_URL;

// GET todos os clientes
export const getClientes = async (): Promise<Clientes[]> => {
    const response = await axios.get<Clientes[]>(`${API_URL}/clientes`);
    return response.data;
}

// GET cliente por ID
export const getClienteById = async (id: number): Promise<Clientes> => {
    const response = await axios.get<Clientes>(`${API_URL}/clientes/${id}`);
    return response.data;
}

// POST - adicionar cliente
export const addCliente = async (cliente: Omit<Clientes, 'id'>): Promise<Clientes> => {
    const response = await axios.post<Clientes>(`${API_URL}/clientes`, cliente);
    return response.data;
}

// PUT - atualizar cliente
export const updateCliente = async (id: number, cliente: Partial<Omit<Clientes, 'id'>>): Promise<Clientes> => {
    const response = await axios.put<Clientes>(`${API_URL}/clientes/${id}`, cliente);
    return response.data;
}

// DELETE - excluir cliente
export const deleteCliente = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/clientes/${id}`);
}



