import axios from 'axios';

interface KpiStats {
    vendasNoMes: number;
    veiculosEmEstoque: number;
    novosClientes: number;
}

interface Activity {
    id: number;
    cliente: string;
    veiculo: string;
    valor: number;
    status: string;
}

interface Funil {
    Lead: number;
    Ativo: number;
    Inativo: number;
}

interface BaixoEstoque {
    marca: string;
    modelo: string;
}

export interface DashboardData {
    kpis: KpiStats;
    atividadesRecentes: Activity[];
    funilDeVendas: Funil;
    baixoEstoque: BaixoEstoque[];
}

interface KpiStats {
    vendasNoMes: number;
    veiculosEmEstoque: number;
    novosClientes: number;
}

interface Activity {
    id: number;
    cliente: string;
    veiculo: string;
    valor: number;
    status: string;
}

interface Funil {
    Lead: number;
    Ativo: number;
    Inativo: number;
}

interface BaixoEstoque {
    marca: string;
    modelo: string;
}

export interface DashboardData {
    kpis: KpiStats;
    atividadesRecentes: Activity[];
    funilDeVendas: Funil;
    baixoEstoque: BaixoEstoque[];
}

const API_URL = import.meta.env.VITE_API_URL;

// GET /api/dashboard/stats
export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await axios.get<DashboardData>(`${API_URL}/dashboard/stats`);
    return response.data;
}