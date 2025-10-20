import axios from 'axios';
import type { Clientes } from '../types/Cliente';

const API_URL = 'http://localhost:5000/clientes';

// GET todos os clientes
export const getClientes = async (): Promise<Clientes[]> => {
    const response = await axios.get<Clientes[]>(API_URL);
    return response.data;
}

// GET cliente por ID
export const getClienteById = async (id: number): Promise<Clientes> => {
    const response = await axios.get<Clientes>(`${API_URL}/${id}`);
    return response.data;
}

// POST - adicionar cliente
export const addCliente = async (cliente: Omit<Clientes, 'id'>): Promise<Clientes> => {
    const response = await axios.post<Clientes>(API_URL, cliente);
    return response.data;
}

// PUT - atualizar cliente
export const updateCliente = async (id: number, cliente: Partial<Omit<Clientes, 'id'>>): Promise<Clientes> => {
    const response = await axios.put<Clientes>(`${API_URL}/${id}`, cliente);
    return response.data;
}

// DELETE - excluir cliente
export const deleteCliente = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}



