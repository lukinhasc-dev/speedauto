import axios from 'axios';
import type { Vendas } from '../types/Venda';

const API_URL = 'http://localhost:5000/vendas';

export const getVendas = async (): Promise<Vendas[]> => {
    const response = await axios.get<Vendas[]>(API_URL);
    return response.data;
}

export const getVendaById = async (id: number): Promise<Vendas> => {
    const response = await axios.get<Vendas>(`${API_URL}/${id}`);
    return response.data;
}

export const addVenda = async (venda: Omit<Vendas, 'id'>): Promise<Vendas> => {
    const response = await axios.post<Vendas>(API_URL, venda);
    return response.data;
}

export const updateVenda = async (id: number, venda: Partial<Omit<Vendas, 'id'>>): Promise<Vendas> => {
    const response = await axios.put<Vendas>(`${API_URL}/${id}`, venda);
    return response.data;
}

export const deleteVenda = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}   
