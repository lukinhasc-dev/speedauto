import axios from 'axios';
import type { Veiculos } from '../types/Veiculo';

const API_URL = import.meta.env.VITE_API_URL;

// GET todos os veículos
export const getVeiculos = async (): Promise<Veiculos[]> => {
    const response = await axios.get<Veiculos[]>(API_URL);
    return response.data;
}

// GET veículo por ID
export const getVeiculoById = async (id: number): Promise<Veiculos> => {
    const response = await axios.get<Veiculos>(`${API_URL}/${id}`);
    return response.data;
}

// POST - adicionar veículo
export const addVeiculo = async (veiculo: Omit<Veiculos, 'id'>): Promise<Veiculos> => {
    const response = await axios.post<Veiculos>(API_URL, veiculo);
    return response.data;
}

// PUT - atualizar veículo
export const updateVeiculo = async (id: number, veiculo: Partial<Omit<Veiculos, 'id'>>): Promise<Veiculos> => {
    const response = await axios.put<Veiculos>(`${API_URL}/${id}`, veiculo);
    return response.data;
}

// DELETE - excluir veículo
export const deleteVeiculo = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
}
