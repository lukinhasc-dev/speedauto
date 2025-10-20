export type StatusCliente = 'Lead' | 'Cliente Ativo' | 'Inativo';

export interface Clientes {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    status: StatusCliente;
}