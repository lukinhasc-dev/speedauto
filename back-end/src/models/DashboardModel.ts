import { supabase } from '../db';

export async function getDashboardStats() {
    try {
        const { data: vendasData, error: vendasError } = await supabase
            .from('vendas')
            .select('valor')
            .eq('status', 'Concluída');

        if (vendasError) throw new Error(`Supabase Vendas Error: ${vendasError.message}`);
        const vendasNoMes = vendasData.reduce((acc, v: any) => acc + (v.valor || 0), 0);

        const { count: estoqueCount, error: estoqueError } = await supabase
            .from('veiculos')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Disponível');

        if (estoqueError) throw new Error(`Supabase Veiculos Error: ${estoqueError.message}`);

        const { count: clientesCount, error: clientesError } = await supabase
            .from('clientes')
            .select('*', { count: 'exact', head: true });

        if (clientesError) throw new Error(`Supabase Clientes Error: ${clientesError.message}`);

        const { data: atividadesData, error: atividadesError } = await supabase
            .from('vendas')
            .select('id, cliente, veiculo, valor, status')
            .order('id', { ascending: false })
            .limit(5);

        if (atividadesError) throw new Error(`Supabase Atividades Error: ${atividadesError.message}`);

        const { data: funilData, error: funilError } = await supabase
            .rpc('get_funil_clientes');

        if (funilError) throw new Error(`Supabase Funil Error: ${funilError.message}`);

        const funil = {
            Lead: funilData.find((f: any) => f.status === 'Lead')?.count || 0,
            Ativo: funilData.find((f: any) => f.status === 'Ativo')?.count || 0,
            Inativo: funilData.find((f: any) => f.status === 'Inativo')?.count || 0,
        };

        const { data: baixoEstoqueData, error: baixoEstoqueError } = await supabase
            .from('veiculos')
            .select('marca, modelo')
            .eq('status', 'Em Manutenção')
            .limit(3);

        if (baixoEstoqueError) throw new Error(`Supabase Baixo Estoque Error: ${baixoEstoqueError.message}`);

        return {
            kpis: {
                vendasNoMes: vendasNoMes,
                veiculosEmEstoque: estoqueCount ?? 0,
                novosClientes: clientesCount ?? 0,
            },
            atividadesRecentes: atividadesData || [],
            funilDeVendas: funil,
            baixoEstoque: baixoEstoqueData || []
        };

    } catch (error) {
        console.error("Erro ao buscar estatísticas do Dashboard:", error);
        throw error;
    }
}