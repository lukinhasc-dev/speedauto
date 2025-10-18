// src/pages/Dashboard.tsx
import React from 'react';
import {
    FaChartLine, FaCar, FaUsers, FaArrowUp, FaPlus
} from 'react-icons/fa';

interface KpiCardProps {
    title: string;
    value: string;
    comparison: string;
    icon: React.ReactNode;
    colorClass: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, comparison, icon, colorClass }) => {
    const isComparison = comparison.includes('vs');

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className={`flex items-center gap-3 text-sm font-medium ${colorClass}`}>
                {icon}
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

type Activity = {
    status: string;
    badge: string;
    desc: string;
    client: string;
    value: string;
};

const ActivityTable: React.FC = () => {
    const activities: Activity[] = [
        { status: 'Vendido', badge: 'bg-green-100 text-green-700', desc: 'BMW 320i - 2022', client: 'Carlos Silva', value: 'R$ 150.000,00' },
        { status: 'Estoque', badge: 'bg-blue-100 text-blue-700', desc: 'Fiat Toro - Placa: XYZ-1234', client: 'Adicionado hoje', value: '-' },
        { status: 'Lead', badge: 'bg-yellow-200 text-yellow-800', desc: 'Interesse em Toyota Corolla', client: 'Maria Souza', value: '-' },
        { status: 'Vendido', badge: 'bg-green-100 text-green-700', desc: 'Hyundai HB20 - 2023', client: 'Ana Pereira', value: 'R$ 85.000,00' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Atividades Recentes</h2>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-2 text-xs font-semibold uppercase text-gray-400">Status</th>
                        <th className="py-2 text-xs font-semibold uppercase text-gray-400">Descrição</th>
                        <th className="py-2 text-xs font-semibold uppercase text-gray-400">Cliente/Origem</th>
                        <th className="py-2 text-xs font-semibold uppercase text-gray-400">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-4"><span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${item.badge}`}>{item.status}</span></td>
                            <td className="py-4 font-medium text-gray-800">{item.desc}</td>
                            <td className="py-4 text-speedauto-muted">{item.client}</td>
                            <td className="py-4 text-speedauto-muted">{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const SalesFunnel: React.FC = () => {
    const stages = [
        { name: 'Novos Leads', value: 12, width: '100%', color: 'bg-speedauto-yellow' },
        { name: 'Contato Feito', value: 8, width: '66%', color: 'bg-speedauto-primary' },
        { name: 'Proposta Enviada', value: 3, width: '25%', color: 'bg-speedauto-green' },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Funil de Vendas</h2>
            <div className="space-y-4">
                {stages.map(stage => (
                    <div key={stage.name}>
                        <div className="flex justify-between font-semibold text-sm mb-1 text-gray-700">
                            <span>{stage.name}</span>
                            <span className="text-gray-500">{stage.value}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                            <div className={`${stage.color} h-2 rounded-full`} style={{ width: stage.width }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

type Task = {
    id: number;
    label: string;
    completed: boolean;
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
        <input
            type="checkbox"
            id={`task-${task.id}`}
            defaultChecked={task.completed}
            className="h-4 w-4 rounded border-gray-300 text-speedauto-primary focus:ring-speedauto-primary"
        />
        <label
            htmlFor={`task-${task.id}`}
            className={`flex-1 text-sm ${task.completed ? 'text-speedauto-muted line-through' : 'text-gray-700'}`}
        >
            {task.label}
        </label>
    </div>
);

const TarefasRapidas: React.FC = () => {
    const tasks: Task[] = [
        { id: 1, label: 'Ligar para o cliente Carlos Silva', completed: true },
        { id: 2, label: 'Enviar fotos do Fiat Toro para lead', completed: false },
        { id: 3, label: 'Agendar test-drive do HB20', completed: false },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Tarefas Rápidas</h2>
                <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                    <FaPlus size={10} /> Nova Tarefa
                </button>
            </div>
            <div>
                {tasks.map(task => <TaskItem key={task.id} task={task} />)}
            </div>
        </div>
    );
}

type StockItem = {
    name: string;
    count: number;
};

const BaixoEstoque: React.FC = () => {
    const items: StockItem[] = [
        { name: 'Jeep Renegade', count: 1 },
        { name: 'VW Nivus', count: 2 },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Veículos | Baixo Estoque</h2>
            <div className="space-y-1">
                {items.map(item => (
                    <div key={item.name} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                        <span className="text-xs font-bold text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">
                            {item.count} Unid.
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default function Dashboard() {
    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    Bom dia, Usuário! 👋
                </h1>
                <p className="text-speedauto-muted mt-1">Aqui está um resumo do seu negócio hoje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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