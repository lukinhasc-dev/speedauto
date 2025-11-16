import React, { useState, useMemo, useEffect } from 'react';
import { FaDownload, FaChartLine, FaCarSide, FaUsers, FaDollarSign, FaCalendarAlt, FaCar, FaUserTie, FaArrowUp, FaArrowDown, FaTimes, FaReceipt } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Veiculos } from '../types/Veiculo';
import type { Venda } from "../types/Venda";
import * as veiculosApi from '../api/veiculosApi';
import * as vendasApi from "../api/vendasApi";

// --- Interfaces ---
interface ReportKpiProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
    trend?: string;
}

interface TopItem {
    name: string;
    value: string;
    count: number;
}

/* ----------------- Charts helpers ----------------- */
interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: { Faturamento: number; Quantidade: number } }>;
    label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white border border-gray-300 p-3 shadow-md text-sm rounded-lg">
                <p className="font-bold text-gray-700">{label}</p>
                <p className="text-speedauto-primary mt-1">Faturamento: {data.Faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p className="text-speedauto-green">Quantidade: {data.Quantidade} vendas</p>
            </div>
        );
    }
    return null;
};

interface RevenueChartData {
    name: string;
    Faturamento: number;
    Quantidade: number;
}

const RevenueChart: React.FC<{ data: RevenueChartData[], dataKey: keyof RevenueChartData }> = ({ data, dataKey }) => {
    const isCurrency = dataKey === 'Faturamento';
    const color = isCurrency ? '#2563EB' : '#16A34A';

    return (
        <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: '12px' }} />
                    <YAxis
                        tickFormatter={(value) => isCurrency ? (value / 1000).toFixed(0) + 'K' : value}
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} activeDot={{ r: 6 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}



/* ----------------- UI components ----------------- */
const ReportKpi: React.FC<ReportKpiProps> = ({ title, value, icon, colorClass, trend }) => {
    const isPositive = trend && trend.includes('+');
    const trendClass = isPositive ? 'text-speedauto-green' : 'text-speedauto-red';
    const TrendIcon = isPositive ? FaArrowUp : FaArrowDown;

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 transition-all hover:shadow-lg">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold uppercase text-gray-500">{title}</h3>
                <div className={`text-xl ${colorClass}`}>{icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-3">{value}</p>
            {trend && (
                <p className={`text-sm font-medium ${trendClass} mt-1 flex items-center gap-1`}>
                    <TrendIcon size={12} className="inline" /> {trend} vs Período Ant.
                </p>
            )}
        </div>
    );
};

const TopTable: React.FC<{ title: string, data: TopItem[], isCurrency?: boolean, icon: React.ReactNode }> = ({ title, data, isCurrency = false, icon }) => (
    <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">{icon} {title}</h3>
        <table className="w-full text-left">
            <thead className="text-xs uppercase text-gray-400 border-b border-gray-200">
                <tr>
                    <th className="py-2 font-semibold">Nome</th>
                    <th className="py-2 text-right font-semibold">{isCurrency ? 'Valor Total' : 'Qtd. Vendas'}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-3 text-sm text-gray-800 font-medium flex items-center gap-2">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">{index + 1}</span>
                            {item.name}
                        </td>
                        <td className="py-3 text-sm text-gray-900 font-bold text-right">
                            {isCurrency ? item.value : item.count}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* ----------------- Main component ----------------- */
export default function Relatorios() {
    const [dataInicio, setDataInicio] = useState<string>(() => {
        const start = new Date();
        start.setMonth(start.getMonth() - 11); // default 12 months back
        const iso = start.toISOString().split('T')[0];
        return iso;
    });
    const [dataFim, setDataFim] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [reportType, setReportType] = useState<'Faturamento' | 'Quantidade'>('Faturamento');
    const [veiculos, setVeiculos] = useState<Veiculos[]>([]);
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [veicRes, vendasRes] = await Promise.all([
                    veiculosApi.getVeiculos(),
                    vendasApi.getVendas()
                ]);
                if (!mounted) return;
                setVeiculos(veicRes);
                setVendas(vendasRes);
            } catch (err) {
                console.error('Erro ao buscar dados:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchAll();
        return () => { mounted = false; };
    }, []);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Filtra vendas pelo período selecionado
    const vendasNoPeriodo = useMemo(() => {
        if (!vendas || vendas.length === 0) return [];
        const start = new Date(dataInicio + 'T00:00:00');
        const end = new Date(dataFim + 'T23:59:59');
        return vendas.filter(v => {
            const d = new Date(v.data);
            return d >= start && d <= end;
        });
    }, [vendas, dataInicio, dataFim]);

    // Agrupa e calcula métricas reais a partir do backend
    const reportData = useMemo(() => {
        // KPIs
        const totalFaturado = vendasNoPeriodo.reduce((acc, v) => acc + Number(v.valor || 0), 0);
        const vehiclesSold = vendasNoPeriodo.length;
        const clientesUnicos = new Set(vendasNoPeriodo.map(v => v.cliente)).size;
        const ticketMedio = vehiclesSold > 0 ? totalFaturado / vehiclesSold : 0;

        // monthlyRevenue agrupando por mês (ordenado)
        const monthlyMap: Record<string, { name: string; Faturamento: number; Quantidade: number; ts: number }> = {};
        vendasNoPeriodo.forEach(v => {
            const d = new Date(v.data);
            const monthLabel = d.toLocaleString('pt-BR', { month: 'short', year: 'numeric' }); // Ex: "jan 2025"
            const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            if (!monthlyMap[key]) monthlyMap[key] = { name: monthLabel, Faturamento: 0, Quantidade: 0, ts: +new Date(d.getFullYear(), d.getMonth(), 1) };
            monthlyMap[key].Faturamento += v.valor;
            monthlyMap[key].Quantidade += 1;
        });
        const monthlyRevenue = Object.keys(monthlyMap)
            .sort()
            .map(key => {
                const { name, Faturamento, Quantidade } = monthlyMap[key];
                return { name, Faturamento, Quantidade };
            });

        // brandSales: usar veiculos para mapear marca via modelo (venda.veiculo é string modelo)
        const brandMap: Record<string, { name: string; Faturamento: number; Quantidade: number; color?: string }> = {};
        veiculos.forEach(v => {
            if (!brandMap[v.marca]) brandMap[v.marca] = { name: v.marca, Faturamento: 0, Quantidade: 0, color: undefined };
        });
        // fallback 'Outros'
        brandMap['Outros'] = brandMap['Outros'] || { name: 'Outros', Faturamento: 0, Quantidade: 0, color: '#9CA3AF' };

        vendasNoPeriodo.forEach(v => {
            // tenta achar veículo pelo modelo (modelo pode não bater exatamente; tenta indexOf, depois exato)
            const veiculoEncontrado = veiculos.find(vc => `${vc.marca} ${vc.modelo}`.toLowerCase() === v.veiculo.toLowerCase())
                || veiculos.find(vc => vc.modelo.toLowerCase() === v.veiculo.toLowerCase())
                || veiculos.find(vc => v.veiculo.toLowerCase().includes(vc.modelo.toLowerCase()))
                || null;
            if (veiculoEncontrado) {
                const marca = veiculoEncontrado.marca;
                if (!brandMap[marca]) brandMap[marca] = { name: marca, Faturamento: 0, Quantidade: 0, color: undefined };
                brandMap[marca].Faturamento += v.valor;
                brandMap[marca].Quantidade += 1;
            } else {
                brandMap['Outros'].Faturamento += v.valor;
                brandMap['Outros'].Quantidade += 1;
            }
        });
        const brandSales = Object.values(brandMap).sort((a, b) => b.Faturamento - a.Faturamento);

        // topVehicles por nome (v.veiculo)
        const topVehiclesMap: Record<string, { name: string; count: number; value: number }> = {};
        vendasNoPeriodo.forEach(v => {
            if (!topVehiclesMap[v.veiculo]) topVehiclesMap[v.veiculo] = { name: v.veiculo, count: 0, value: 0 };
            topVehiclesMap[v.veiculo].count += 1;
            topVehiclesMap[v.veiculo].value += v.valor;
        });
        const topVehicles = Object.values(topVehiclesMap).sort((a, b) => b.count - a.count);

        // topCustomers (substitui top sellers já que não há vendedores)
        const topCustomersMap: Record<string, { name: string; count: number; value: number }> = {};
        vendasNoPeriodo.forEach(v => {
            if (!topCustomersMap[v.cliente]) topCustomersMap[v.cliente] = { name: v.cliente, count: 0, value: 0 };
            topCustomersMap[v.cliente].count += 1;
            topCustomersMap[v.cliente].value += v.valor;
        });
        const topCustomers = Object.values(topCustomersMap).sort((a, b) => b.value - a.value);

        // --- TAXA DE VENDAS ---
        // total de vendas concluídas no período
        const vendasConcluidasPeriodo = vendasNoPeriodo.filter(v => v.status === "Concluída").length;

        // total concluído no ano inteiro (ou seja, base geral)
        const totalConcluidasAno = vendas.filter(v => v.status === "Concluída").length;

        // taxa (%) -> representa qual porcentagem das vendas concluídas no ano
        // foram feitas dentro do período selecionado
        const taxaVendas = totalConcluidasAno > 0
            ? (vendasConcluidasPeriodo / totalConcluidasAno) * 100
            : 0;


        // --- TENDÊNCIA (comparação com período anterior) ---
        const inicio = new Date(dataInicio + "T00:00:00");
        const fim = new Date(dataFim + "T23:59:59");
        const diff = fim.getTime() - inicio.getTime();

        const inicioAnterior = new Date(inicio.getTime() - diff);
        const fimAnterior = new Date(inicio.getTime() - 1);

        const vendasPeriodoAnterior = vendas.filter(v => {
            const d = new Date(v.data);
            return d >= inicioAnterior && d <= fimAnterior && v.status === "Concluída";
        });

        const taxaAnterior = totalConcluidasAno > 0
            ? (vendasPeriodoAnterior.length / totalConcluidasAno) * 100
            : 0;

        const diffTaxaVendas = taxaAnterior === 0
            ? "+0%"
            : (((taxaVendas - taxaAnterior) / taxaAnterior) * 100).toFixed(1) + "%";

        return {
            revenue: totalFaturado,
            vehiclesSold,
            newClients: clientesUnicos,
            averageTicket: ticketMedio,
            monthlyRevenue,
            brandSales,
            topVehicles,
            topSellers: topCustomers,

            taxaVendas,
            taxaVendasTrend: diffTaxaVendas
        };
    }, [vendasNoPeriodo, veiculos, dataInicio, dataFim]);

    const chartDataKey = reportType === 'Faturamento' ? 'Faturamento' : 'Quantidade';
    const chartTitle = reportType === 'Faturamento' ? 'Evolução de Faturamento' : 'Evolução de Volume de Vendas';
    const isMainMetricFaturamento = reportType === 'Faturamento';
    const mainKpiValue = isMainMetricFaturamento ? formatCurrency(reportData.revenue) : reportData.vehiclesSold.toString();
    const mainKpiTitle = isMainMetricFaturamento ? 'Faturamento Total' : 'Veículos Vendidos';
    const mainKpiIcon = isMainMetricFaturamento ? <FaDollarSign /> : <FaCarSide />;
    const mainKpiTrend = isMainMetricFaturamento ? '+18%' : '-5%';

    const setPeriodShortcut = (days: number) => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - days);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        setDataInicio(formatDate(start));
        setDataFim(formatDate(today));
    };

    const clearDates = () => {
        setDataInicio(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
        setDataFim(new Date().toISOString().split('T')[0]);
    };

    // Export CSV das vendas do período
    const exportCsv = () => {
        const data = vendasNoPeriodo;
        if (!data || data.length === 0) {
            alert('Nenhuma venda encontrada no período selecionado.');
            return;
        }

        // Cabeçalho (usar ponto e vírgula pra Excel pt-BR)
        const headers = [
            'id', 'veiculo', 'cliente', 'data', 'valor', 'status', 'observacoes', 'marca_veiculo', 'modelo_veiculo', 'placa_veiculo'
        ];
        const rows = data.map(v => {
            const ve = veiculos.find(vc => `${vc.marca} ${vc.modelo}`.toLowerCase() === v.veiculo.toLowerCase())
                || veiculos.find(vc => vc.modelo.toLowerCase() === v.veiculo.toLowerCase())
                || null;
            const marca = ve ? ve.marca : '';
            const modelo = ve ? ve.modelo : '';
            const placa = ve ? ve.placa : '';
            // Formata valor com vírgula decimal (opcional), mas mantemos ponto para compatibilidade
            const valor = Number(v.valor || 0).toFixed(2);
            return [
                v.id,
                `"${v.veiculo.replace(/"/g, '""')}"`,
                `"${v.cliente.replace(/"/g, '""')}"`,
                v.data,
                valor,
                v.status,
                `"${(v.observacoes || '').replace(/"/g, '""')}"`,
                `"${marca}"`,
                `"${modelo}"`,
                `"${placa}"`
            ].join(';');
        });

        const csvContent = [headers.join(';'), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const filename = `vendas_${dataInicio}_${dataFim}.csv`;
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <p>Carregando relatório...</p>;
    }

    return (
        <>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Relatórios e Análises</h1>
                    <p className="text-gray-500 mt-1">Transforme dados em inteligência de negócio.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-all shadow-sm"
                        onClick={exportCsv}>
                        <FaDownload /> Exportar Vendas (CSV)
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                <div className="flex gap-2 text-sm">
                    <button onClick={() => setPeriodShortcut(30)} className="py-1 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Últimos 30 dias</button>
                    <button onClick={() => setPeriodShortcut(90)} className="py-1 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Últimos 90 dias</button>
                    <button onClick={() => setPeriodShortcut(365)} className="py-1 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Último Ano</button>
                </div>

                <div className="flex items-center gap-6">
                    <FaCalendarAlt className="text-speedauto-primary text-xl hidden sm:block" />
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">De:</span>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg p-2 text-sm bg-white shadow-sm text-gray-700 cursor-pointer"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            title="Data de Início"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">Até:</span>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg p-2 text-sm bg-white shadow-sm text-gray-700 cursor-pointer"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            title="Data Final"
                        />
                    </div>

                    {(dataInicio !== '' || dataFim !== '') && (
                        <button
                            onClick={clearDates}
                            className="text-speedauto-red hover:text-red-700 transition-colors p-1"
                            title="Limpar Datas"
                        >
                            <FaTimes size={18} />
                        </button>
                    )}
                </div>

                <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200 ml-auto lg:ml-0">
                    <button
                        onClick={() => setReportType('Faturamento')}
                        className={`py-1 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${reportType === 'Faturamento' ? 'bg-white shadow text-speedauto-primary' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <FaDollarSign /> Faturamento
                    </button>
                    <button
                        onClick={() => setReportType('Quantidade')}
                        className={`py-1 px-4 text-sm font-semibold rounded-lg flex items-center gap-2 transition-all ${reportType === 'Quantidade' ? 'bg-white shadow text-speedauto-green' : 'text-gray-600 hover:text-gray-800'}`}
                    >
                        <FaCar /> Quantidade
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <ReportKpi
                    title={mainKpiTitle}
                    value={mainKpiValue}
                    trend={mainKpiTrend}
                    icon={mainKpiIcon}
                    colorClass={isMainMetricFaturamento ? "text-speedauto-primary" : "text-speedauto-yellow"}
                />

                <ReportKpi
                    title="Ticket Médio"
                    value={formatCurrency(reportData.averageTicket)}
                    icon={<FaReceipt />}
                    colorClass="text-speedauto-green"
                />
                <ReportKpi
                    title="Novos Clientes"
                    value={reportData.newClients.toString()}
                    trend="+12%"
                    icon={<FaUsers />}
                    colorClass="text-blue-500"
                />
                <ReportKpi
                    title="Taxa de Vendas"
                    value={reportData.taxaVendas.toFixed(1) + "%"}
                    trend={reportData.taxaVendasTrend}
                    icon={<FaChartLine />}
                    colorClass="text-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-96 flex flex-col">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">{chartTitle}</h3>
                        <RevenueChart data={reportData.monthlyRevenue} dataKey={chartDataKey} />
                    </div>
                </div>

                <TopTable
                    title="Top Clientes"
                    data={reportData.topSellers.map(s => ({ name: s.name, value: formatCurrency(s.value), count: s.count }))}
                    isCurrency={false}
                    icon={<FaUserTie />}
                />
            </div>
        </>
    );
}
