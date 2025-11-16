import axios from 'axios';
import type { Venda } from '../types/Venda';

const API_URL = 'http://localhost:5000/vendas';

export const getVendas = async (): Promise<Venda[]> => {
    const response = await axios.get<Venda[]>(API_URL);
    return response.data;
}

export const getVendaById = async (id: number): Promise<Venda> => {
    const response = await axios.get<Venda>(`${API_URL}/${id}`);
    return response.data;
}

export const addVenda = async (venda: Omit<Venda, 'id'>): Promise<Venda> => {
    const response = await axios.post<Venda>(API_URL, venda);
    return response.data;
}

export const updateVenda = async (id: number, venda: Partial<Omit<Venda, 'id'>>): Promise<Venda> => {
    const response = await axios.put<Venda>(`${API_URL}/${id}`, venda);
    return response.data;
}

export const deleteVenda = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}   
