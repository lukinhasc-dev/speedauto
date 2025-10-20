export type StatusVeiculo = 'Disponível' | 'Vendido' | 'Em Manutenção';

export interface Veiculos {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  combustivel: string;
  placa: string;
  valor_venda: number;
  status: StatusVeiculo;
}