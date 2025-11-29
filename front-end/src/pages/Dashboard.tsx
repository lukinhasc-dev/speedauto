import React, { useState, useEffect } from 'react';
import {
    FaChartLine, FaCar, FaUsers, FaArrowUp, FaPlus, FaTimes, FaBell, FaClipboardList, FaArrowRight, FaSpinner
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getDashboardData, type DashboardData } from '../api/dashboardApi';
import InputModal from '../components/InputModal';

// --- Interfaces ---
interface KpiCardProps {
    title: string;
    value: string;
    comparison: string;
    icon: React.ReactNode;
    colorClass: string;
}

type Activity = {
    id: number;
    status: 'Vendido' | 'Estoque' | 'Lead' | string;
    veiculo: string;
    cliente: string;
    valor: number;
};

type Task = {
    id: number;
    label: string;
    completed: boolean;
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, comparison, icon, colorClass }) => {
    const isComparison = comparison.includes('vs');
    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 transition-all hover:shadow-md hover:-translate-y-0.5 duration-300">
            <div className={`flex items-center gap-3 text-sm font-medium ${colorClass}`}>
                <div className="p-2 rounded-full bg-current/10">{icon}</div>
                <h3 className="text-speedauto-muted">{title}</h3>
            </div>
            <div className="mt-2">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className={`text-sm mt-1 font-medium flex items-center gap-1 ${isComparison ? 'text-speedauto-green' : 'text-speedauto-muted'}`}>
                    {isComparison && <FaArrowUp size={12} />} {comparison}
                </p>
            </div>
        </div>
    );
};

const renderStatusBadge = (status: Activity['status']) => {
    const styles: Record<string, string> = {
        'Concluída': 'bg-green-100 text-green-700',
        'Vendido': 'bg-green-100 text-green-700',
        'Em Andamento': 'bg-yellow-100 text-yellow-700',
        'Lead': 'bg-blue-100 text-blue-700',
        'Estoque': 'bg-blue-100 text-blue-700',
    };
    const defaultStyle = 'bg-gray-100 text-gray-700';
    return <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || defaultStyle} whitespace-nowrap`}>{status}</span>;
};

const ActivityTable: React.FC<{ activities: DashboardData['atividadesRecentes'] }> = ({ activities }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Atividades Recentes</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="py-3 text-xs font-semibold uppercase text-gray-400">Status</th>
                            <th className="py-3 text-xs font-semibold uppercase text-gray-400">Descrição</th>
                            <th className="py-3 text-xs font-semibold uppercase text-gray-400">Cliente/Origem</th>
                            <th className="py-3 text-xs font-semibold uppercase text-gray-400 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.length > 0 ? (
                            activities.map((item, index) => (
                                <tr
                                    key={item.id || index}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => navigate('/vendas')}
                                >
                                    <td className="py-3 w-[120px]">{renderStatusBadge(item.status)}</td>
                                    <td className="py-3 font-medium text-gray-800">{item.veiculo}</td>
                                    <td className="py-3 text-speedauto-muted">{item.cliente}</td>
                                    <td className="py-3 text-right">
                                        <button className="text-speedauto-primary text-xs font-semibold hover:underline flex items-center justify-end gap-1 ml-auto">
                                            Ver Venda <FaArrowRight size={8} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-gray-500">Nenhuma atividade recente registrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SalesFunnel: React.FC<{ funil: DashboardData['funilDeVendas'] }> = ({ funil }) => {
    const totalContatos = (funil.Lead || 0) + (funil.Ativo || 0) + (funil.Inativo || 0);

    const getPercent = (value: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    };

    const stages = [
        { name: 'Novos Leads', value: funil.Lead || 0, percent: getPercent(funil.Lead, totalContatos || 1), color: 'bg-speedauto-yellow' },
        { name: 'Clientes Ativos', value: funil.Ativo || 0, percent: getPercent(funil.Ativo, totalContatos || 1), color: 'bg-speedauto-green' },
        { name: 'Clientes Inativos', value: funil.Inativo || 0, percent: getPercent(funil.Inativo, totalContatos || 1), color: 'bg-speedauto-red' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Funil de Clientes (CRM)</h2>
                <div className="space-y-4">
                    {stages.map(stage => (
                        <div key={stage.name} className="transition-all hover:bg-gray-50 p-2 rounded-lg -mx-2 duration-200 cursor-pointer">
                            <div className="flex justify-between font-semibold text-sm mb-1 text-gray-700">
                                <span>{stage.name}</span>
                                <span className="text-gray-500">{stage.value}</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className={`${stage.color} h-2.5 rounded-full transition-all duration-500`}
                                    style={{ width: `${stage.percent}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-right text-gray-500 mt-1">{stage.percent}% do Total</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TarefasRapidas: React.FC = () => {

    const [tasks, setTasks] = useState<Task[]>(() => {
        const savedTasks = localStorage.getItem('speedauto_tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [showInputModal, setShowInputModal] = useState(false);

    useEffect(() => {
        localStorage.setItem('speedauto_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        setShowInputModal(true);
    };

    const handleConfirmAddTask = (newTaskLabel: string) => {
        const newTask: Task = {
            id: Date.now(),
            label: newTaskLabel,
            completed: false,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const handleToggle = (id: number) => {
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const handleDelete = (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 -mx-2 px-2 rounded transition-colors duration-200 group hover:bg-gray-50">
            <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                readOnly
                onChange={() => handleToggle(task.id)}
                className="h-4 w-4 rounded border-gray-300 text-speedauto-primary focus:ring-speedauto-primary transition-colors cursor-pointer"
            />
            <label
                htmlFor={`task-${task.id}`}
                className={`flex-1 text-sm ${task.completed ? 'text-speedauto-muted line-through' : 'text-gray-700'} cursor-pointer`}
                onClick={(e) => {
                    e.preventDefault();
                    handleToggle(task.id);
                }}
            >
                {task.label}
            </label>

            <button
                onClick={() => handleDelete(task.id)}
                className="text-gray-400 hover:text-speedauto-red p-1 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Excluir Tarefa"
            >
                <FaTimes size={12} />
            </button>
        </div>
    );

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Anotações Rápidas</h2>
                <button
                    onClick={handleAddTask}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-speedauto-primary bg-speedauto-primary/10 rounded-lg hover:bg-speedauto-primary/20 transition-colors"
                >
                    <FaPlus size={10} /> Nova Tarefa
                </button>
            </div>
            <div className="space-y-1">
                {tasks.length > 0 ? (
                    [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))
                        .map(task => <TaskItem key={task.id} task={task} />)
                ) : (
                    <div className="text-center py-4 text-gray-500 text-sm flex flex-col items-center">
                        <FaClipboardList className="text-3xl text-gray-300 mb-2" />
                        Sem tarefas pendentes!
                    </div>
                )}
            </div>

            {/* Modal para adicionar tarefa */}
            <InputModal
                isOpen={showInputModal}
                onClose={() => setShowInputModal(false)}
                onConfirm={handleConfirmAddTask}
                title="Nova Anotação"
                placeholder="Digite sua anotação..."
                confirmButtonText="Adicionar"
            />
        </div>
    );
};

const BaixoEstoque: React.FC<{ items: DashboardData['baixoEstoque'] }> = ({ items }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaBell className="text-speedauto-yellow" /> Alerta | Em Manutenção
            </h2>
            <div className="space-y-1 flex-grow">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm font-medium text-gray-700">{item.marca} {item.modelo}</span>
                            <span className="text-xs font-bold text-speedauto-yellow bg-yellow-100 px-2 py-1 rounded-full border border-yellow-300">
                                Em Manutenção
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center pt-4">Nenhum veículo em manutenção.</p>
                )}
            </div>
            <button
                onClick={() => navigate('/veiculos')}
                className="mt-4 w-full text-center text-sm font-semibold text-speedauto-primary bg-speedauto-primary/10 py-2 rounded-lg hover:bg-speedauto-primary/20 transition-colors"
            >
                Gerenciar Estoque
            </button>
        </div>
    );
};

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getDashboardData();
                setStats(data);
            } catch (err: any) {
                const errorMessage = err.response?.data?.error || err.message || "Erro ao carregar dados do Dashboard.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-speedauto-primary" />
                <p className="ml-4 text-gray-500">Carregando dados do Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 bg-red-50 border border-red-200">{error}</div>;
    }

    if (!stats) {
        return <div className="p-10 text-center text-gray-500">Nenhum dado para exibir.</div>;
    }

    return (
        <>
            <div className="pb-4 border-b border-gray-200 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Bem vindo ao SpeedAuto! 👋</h1>
                <p className="text-speedauto-muted mt-1">Aqui está um resumo do seu negócio hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Vendas no Mês"
                    value={formatCurrency(stats.kpis.vendasNoMes)}
                    comparison="+15% vs mês anterior"
                    icon={<FaChartLine />}
                    colorClass="text-speedauto-primary"
                />
                <KpiCard
                    title="Veículos em Estoque"
                    value={`${stats.kpis.veiculosEmEstoque} Unidades`}
                    comparison="Total em estoque"
                    icon={<FaCar />}
                    colorClass="text-speedauto-yellow"
                />
                <KpiCard
                    title="Total de Clientes"
                    value={stats.kpis.novosClientes.toString()}
                    comparison="Registrados"
                    icon={<FaUsers />}
                    colorClass="text-speedauto-green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <ActivityTable activities={stats.atividadesRecentes} />
                </div>
                <div>
                    <SalesFunnel funil={stats.funilDeVendas} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <TarefasRapidas />
                </div>
                <div>
                    <BaixoEstoque items={stats.baixoEstoque} />
                </div>
            </div>
        </>
    );
}