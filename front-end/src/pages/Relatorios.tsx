import React, { useState, useMemo } from 'react';
import { FaDownload, FaChartLine, FaCarSide, FaUsers, FaDollarSign, FaCalendarAlt, FaCar, FaUserTie, FaArrowUp, FaArrowDown, FaTimes, FaReceipt } from 'react-icons/fa'; // Importa FaTimes
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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

const MOCK_DATA = {
    revenue: 350800,
    vehiclesSold: 8,
    newClients: 22,
    averageTicket: 43850,

    monthlyRevenue: [
        { name: 'Jan', Faturamento: 150000, Quantidade: 5 },
        { name: 'Fev', Faturamento: 180000, Quantidade: 8 },
        { name: 'Mar', Faturamento: 220000, Quantidade: 10 },
        { name: 'Abr', Faturamento: 190000, Quantidade: 7 },
        { name: 'Mai', Faturamento: 250000, Quantidade: 12 },
        { name: 'Jun', Faturamento: 300000, Quantidade: 15 },
    ],

    brandSales: [
        { name: 'Fiat', Faturamento: 300000, Quantidade: 5, color: '#2563EB' },
        { name: 'BMW', Faturamento: 500000, Quantidade: 2, color: '#F59E0B' },
        { name: 'Ford', Faturamento: 250000, Quantidade: 3, color: '#16A34A' },
        { name: 'Outros', Faturamento: 100000, Quantidade: 1, color: '#DC2626' },
    ],

    topVehicles: [
        { name: 'VW Gol', value: 'R$ 80.000,00', count: 3 },
        { name: 'Fiat Uno', value: 'R$ 35.000,00', count: 2 },
        { name: 'BMW X3', value: 'R$ 350.000,00', count: 1 },
    ],

    topSellers: [
        { name: 'João S.', value: 'R$ 200.000,00', count: 4 },
        { name: 'Maria F.', value: 'R$ 150.800,00', count: 4 },
    ]
};


const CustomTooltip = ({ active, payload, label }: any) => {
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

const RevenueChart: React.FC<{ data: any[], dataKey: string }> = ({ data, dataKey }) => {
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
                    <Tooltip content={<CustomTooltip dataKey={dataKey} />} />
                    <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} activeDot={{ r: 6 }} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

const BrandPieChart: React.FC<{ data: any[], dataKey: 'Faturamento' | 'Quantidade' }> = ({ data, dataKey }) => {
    const formatter = (value: number) => {
        return dataKey === 'Faturamento' ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : value;
    };

    return (
        <div className="flex-grow flex justify-center items-center">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={formatter} />
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}


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


export default function Relatorios() {
    const [dataInicio, setDataInicio] = useState<string>('2025-01-01');
    const [dataFim, setDataFim] = useState<string>('2025-12-31');
    const [reportType, setReportType] = useState<'Faturamento' | 'Quantidade'>('Faturamento');
    const [pieChartMetric, setPieChartMetric] = useState<'Faturamento' | 'Quantidade'>('Faturamento');

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const reportData = useMemo(() => {
        const factor = dataInicio === '2025-01-01' ? 1.0 : 0.8;

        return {
            revenue: MOCK_DATA.revenue * factor,
            vehiclesSold: Math.round(MOCK_DATA.vehiclesSold * factor),
            newClients: Math.round(MOCK_DATA.newClients * factor),
            averageTicket: MOCK_DATA.averageTicket,

            monthlyRevenue: MOCK_DATA.monthlyRevenue,
            brandSales: MOCK_DATA.brandSales,

            topVehicles: MOCK_DATA.topVehicles.map(item => ({
                ...item,
                count: Math.max(1, Math.round(item.count * factor)),
            })),
            topSellers: MOCK_DATA.topSellers,
        };
    }, [dataInicio, dataFim]);

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
        setDataInicio('2025-01-01');
        setDataFim('2025-12-31');
    };


    return (
        <>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Relatórios e Análises</h1>
                    <p className="text-gray-500 mt-1">Transforme dados em inteligência de negócio.</p>
                </div>
                <button
                    className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-all shadow-sm"
                    onClick={() => alert('Simulando exportação do relatório...')}>
                    <FaDownload /> Exportar Relatório
                </button>
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

                    {(dataInicio !== '2025-01-01' || dataFim !== '2025-12-31') && (
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
                    title="Taxa de Conversão"
                    value="25%"
                    trend="-2%"
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
                    title="Top Vendedores"
                    data={reportData.topSellers.map(s => ({ ...s, value: s.count.toString() }))}
                    isCurrency={false}
                    icon={<FaUserTie />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

                <TopTable
                    title="Veículos Mais Vendidos"
                    data={reportData.topVehicles}
                    isCurrency={false}
                    icon={<FaCar />}
                />

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-96 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Vendas por Marca</h3>
                            <div className="flex bg-gray-100 rounded-lg p-1 text-sm border border-gray-200">
                                <button
                                    onClick={() => setPieChartMetric('Faturamento')}
                                    className={`py-0.5 px-2 font-medium rounded-lg transition-all ${pieChartMetric === 'Faturamento' ? 'bg-white shadow text-speedauto-primary' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Valor
                                </button>
                                <button
                                    onClick={() => setPieChartMetric('Quantidade')}
                                    className={`py-0.5 px-2 font-medium rounded-lg transition-all ${pieChartMetric === 'Quantidade' ? 'bg-white shadow text-speedauto-green' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    Qtd.
                                </button>
                            </div>
                        </div>
                        <BrandPieChart data={reportData.brandSales} dataKey={pieChartMetric} />
                    </div>
                </div>
            </div>
        </>
    );
}