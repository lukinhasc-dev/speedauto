export type StatusVendas = 'Em Andamento' | 'Concluída' | 'Cancelada';

export interface Venda {
    id: number;
    veiculo: string;
    cliente: string;
    data: string;
    valor: number;
    status: StatusVendas;
    observacoes: string;
}
