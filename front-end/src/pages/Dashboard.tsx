import React, { useState } from 'react';
import {
    FaChartLine, FaCar, FaUsers, FaArrowUp, FaPlus, FaTimes, FaBell, FaClipboardList, FaArrowRight} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface KpiCardProps {
    title: string;
    value: string;
    comparison: string;
    icon: React.ReactNode;
    colorClass: string;
}

type Activity = {
    status: 'Vendido' | 'Estoque' | 'Lead';
    desc: string;
    client: string;
    value: string;
    actionLink: string;
};

type Task = {
    id: number;
    label: string;
    completed: boolean;
};

type StockItem = {
    name: string;
    count: number;
};

const MOCK_ACTIVITIES: Activity[] = [
    { status: 'Vendido', desc: 'BMW 320i - 2022', client: 'Carlos Silva', value: 'R$ 150.000,00', actionLink: '/vendas' },
    { status: 'Estoque', desc: 'Fiat Toro - Placa: XYZ-1234', client: 'Adicionado hoje', value: '-', actionLink: '/veiculos' },
    { status: 'Lead', desc: 'Interesse em Corolla', client: 'Maria Souza', value: '-', actionLink: '/clientes' },
    { status: 'Vendido', desc: 'Hyundai HB20 - 2023', client: 'Ana Pereira', value: 'R$ 85.000,00', actionLink: '/vendas' },
];

const MOCK_TASKS: Task[] = [
    { id: 1, label: 'Ligar para o cliente Carlos Silva', completed: true },
    { id: 2, label: 'Enviar fotos do Fiat Toro para lead', completed: false },
    { id: 3, label: 'Agendar test-drive do HB20', completed: false },
];

const MOCK_STOCK: StockItem[] = [
    { name: 'Jeep Renegade', count: 1 },
    { name: 'VW Nivus', count: 2 },
];

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
}

const renderStatusBadge = (status: Activity['status']) => {
    const baseStyle = 'inline-block px-3 py-1 text-xs font-semibold rounded-full';
    const styles = {
        'Vendido': 'bg-green-100 text-green-700',
        'Estoque': 'bg-blue-100 text-blue-700',
        'Lead': 'bg-yellow-200 text-yellow-800',
    };
    return <span className={`${baseStyle} ${styles[status]}`}>{status}</span>;
};

const ActivityTable: React.FC = () => {
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
                        {MOCK_ACTIVITIES.map((item, index) => (
                            <tr 
                                key={index} 
                                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => navigate(item.actionLink)}
                            >
                                <td className="py-3 w-[120px]">{renderStatusBadge(item.status)}</td>
                                <td className="py-3 font-medium text-gray-800">{item.desc}</td>
                                <td className="py-3 text-speedauto-muted">{item.client}</td>
                                <td className="py-3 text-right">
                                    <button 
                                        className="text-speedauto-primary text-xs font-semibold hover:underline flex items-center justify-end gap-1 ml-auto"
                                    >
                                        Ver Detalhes <FaArrowRight size={8} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const SalesFunnel: React.FC = () => {
    const stages = [
        { name: 'Novos Leads', value: 12, percent: 100, color: 'bg-speedauto-yellow' },
        { name: 'Contato Feito', value: 8, percent: 66, color: 'bg-speedauto-primary' },
        { name: 'Proposta Enviada', value: 3, percent: 25, color: 'bg-speedauto-green' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Funil de Vendas</h2>
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
                            <p className="text-xs text-right text-gray-500 mt-1">{stage.percent}% de {stages[0].value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const TarefasRapidas: React.FC = () => {
    const [tasks, setTasks] = useState(MOCK_TASKS);
    
    const handleAddTask = () => {
        const newTaskLabel = prompt("Digite a nova tarefa:");
        if (newTaskLabel && newTaskLabel.trim()) {
            const newTask: Task = {
                id: Date.now(),
                label: newTaskLabel.trim(),
                completed: false,
            };
            setTasks(prevTasks => [...prevTasks, newTask]);
        }
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
                <h2 className="text-xl font-semibold text-gray-800">Tarefas Rápidas</h2>
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
        </div>
    );
}

const BaixoEstoque: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-lg p-6 shadow border border-gray-200 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaBell className="text-speedauto-red" /> Alerta | Baixo Estoque
            </h2>
            <div className="space-y-1 flex-grow">
                {MOCK_STOCK.map(item => (
                    <div key={item.name} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <span className="text-xs font-bold text-speedauto-red bg-red-100 px-2 py-1 rounded-full border border-red-300">
                            {item.count} Unid.
                        </span>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => navigate('/veiculos')}
                className="mt-4 w-full text-center text-sm font-semibold text-speedauto-primary bg-speedauto-primary/10 py-2 rounded-lg hover:bg-speedauto-primary/20 transition-colors"
            >
                Gerenciar Estoque
            </button>
        </div>
    );
}


export default function Dashboard() {
    return (
        <>
            <div className="pb-4 border-b border-gray-200 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Olá, Usuário! 👋</h1>
                <p className="text-speedauto-muted mt-1">Aqui está um resumo do seu negócio hoje. Utilize a busca acima para encontrar informações rapidamente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Vendas no Mês"
                    value="R$ 120.500,00"
                    comparison="15% vs mês anterior"
                    icon={<FaChartLine />}
                    colorClass="text-speedauto-primary"
                />
                <KpiCard
                    title="Veículos em Estoque"
                    value="42 Unidades"
                    comparison="Valor total: R$ 2.1M"
                    icon={<FaCar />}
                    colorClass="text-speedauto-yellow"
                />
                <KpiCard
                    title="Novos Clientes"
                    value="15"
                    comparison="Meta do mês: 20"
                    icon={<FaUsers />}
                    colorClass="text-speedauto-green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <ActivityTable />
                </div>
                <div>
                    <SalesFunnel />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                    <TarefasRapidas />
                </div>
                <div>
                    <BaixoEstoque />
                </div>
            </div>
        </>
    );
}