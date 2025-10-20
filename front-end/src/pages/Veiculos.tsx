import React, { useState, type FormEvent, useMemo, useEffect } from 'react';
import { FaPlus, FaEye, FaPencilAlt, FaTrash, FaTimes, FaCar, FaSearch, FaInfoCircle, FaCalendarAlt, FaPalette, FaGasPump, FaClipboardCheck, FaCarSide } from 'react-icons/fa';
import type { Veiculos } from '../types/Veiculo';
import * as veiculosApi from '../api/veiculosApi';

type ModalMode = 'closed' | 'add' | 'edit' | 'delete' | 'view';

interface DetailItemProps {
    label: string;
    value: string | number | React.ReactNode;
    icon: React.ReactNode;
    highlight?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, icon, highlight = false }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className={`p-2 rounded-full ${highlight ? 'bg-speedauto-primary/10 text-speedauto-primary' : 'bg-gray-200 text-gray-600'}`}>
            {icon}
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
            <div className={`text-base mt-0.5 ${highlight ? 'font-bold text-speedauto-primary' : 'font-medium text-gray-800'}`}>
                {value}
            </div>
        </div>
    </div>
);


export default function Veiculos() {
    const [vehicles, setVehicles] = useState<Veiculos[]>([]);
    const [modalMode, setModalMode] = useState<ModalMode>('closed');
    const [selectedVehicle, setSelectedVehicle] = useState<Veiculos | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('Todos');
    const [filterMarca, setFilterMarca] = useState<string>('Todas');


    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const allVehicles = await veiculosApi.getVeiculos();
                setVehicles(allVehicles);
            } catch (err) {
                console.error('Erro ao buscar veículos:', err);
            }
        };

        fetchVehicles();
    }, []);
    
    const availableMarcas = useMemo(() => {
        const marcas = vehicles.map(v => v.marca);
        return [...new Set(marcas)].sort();
    }, [vehicles]);
    
    const filteredVehicles = useMemo(() => {
        let currentVehicles = vehicles;
        const lowerCaseSearch = searchTerm.toLowerCase();

        if (filterStatus !== 'Todos') {
            currentVehicles = currentVehicles.filter(v => v.status === filterStatus);
        }

        if (filterMarca !== 'Todas') {
            currentVehicles = currentVehicles.filter(v => v.marca === filterMarca);
        }

        if (searchTerm) {
            currentVehicles = currentVehicles.filter(v =>
                v.marca.toLowerCase().includes(lowerCaseSearch) ||
                v.modelo.toLowerCase().includes(lowerCaseSearch) ||
                v.placa.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return currentVehicles;
    }, [vehicles, searchTerm, filterStatus, filterMarca]);


    const openModal = (mode: ModalMode, vehicle: Veiculos | null = null) => {
        setModalMode(mode);
        setSelectedVehicle(vehicle);
    };
    const closeModal = () => {
        setModalMode('closed');
        setSelectedVehicle(null);
    };

    const handleSaveVehicle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const formData = new FormData(e.currentTarget);
        const formDataObj = Object.fromEntries(formData.entries());

        // Validação básica dos campos obrigatórios
        const requiredFields = ['marca', 'modelo', 'placa', 'ano', 'valor'];
        for (const field of requiredFields) {
            if (!formDataObj[field] || String(formDataObj[field]).trim() === '') {
                alert(`O campo "${field}" é obrigatório.`);
                return;
            }
        }

        // Conversão dos campos numéricos corretamente
        const ano = parseInt(formDataObj.ano as string);
        const valor_venda = parseFloat(formDataObj.valor as string);

        if (isNaN(ano)) {
            alert('Ano inválido.');
            return;
        }
        if (isNaN(valor_venda)) {
            alert('Valor de venda inválido.');
            return;
        }

        const vehicleData: Omit<Veiculos, 'id'> = {
            marca: String(formDataObj.marca),
            modelo: String(formDataObj.modelo),
            cor: String(formDataObj.cor || ''),
            combustivel: String(formDataObj.combustivel || ''),
            placa: String(formDataObj.placa),
            status: String(formDataObj.status) as Veiculos['status'],
            valor_venda,
            ano,
        };

        let savedVehicle: Veiculos;

        if (modalMode === 'add') {
            savedVehicle = await veiculosApi.addVeiculo(vehicleData);
            setVehicles(prev => [...prev, savedVehicle]);
        } else if (modalMode === 'edit' && selectedVehicle) {
            savedVehicle = await veiculosApi.updateVeiculo(selectedVehicle.id, vehicleData);
            setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? savedVehicle : v));
        }

        closeModal();

    } catch (error) {
        console.error('Erro ao salvar veículo:', error);
        alert('Ocorreu um erro ao salvar o veículo. Verifique o console para mais detalhes.');
    }
};

    const handleDeleteVehicle = async () => {
        if (!selectedVehicle) return;

        try {
            // Chamada à API para excluir o veículo
            await veiculosApi.deleteVeiculo(selectedVehicle.id);
            setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));

            //Fechando o Model
            closeModal();

        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            alert('Ocorreu um erro ao excluir o veículo. Por favor, tente novamente.');
        }
    };

    const renderStatusBadge = (status: Veiculos['status']) => {
        const styles: Record<Veiculos['status'], string> = {
            'Disponível': 'bg-green-100 text-green-700',
            'Vendido': 'bg-red-100 text-red-700',
            'Em Manutenção': 'bg-yellow-100 text-yellow-700',
        };
        return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };


    //Função para Placa do Veículo
    const [placa, setPlaca] = useState<string>('');

const formatPlate = (value: string) => {
  // remove tudo que não seja letra ou número
  let v = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  // coloca hífen depois das 3 primeiras letras
  if (v.length > 3) {
    v = v.slice(0, 3) + '-' + v.slice(3, 7); // limita a 7 caracteres (ex: XXX-9999)
  }
  return v;
};





    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Estoque de Veículos</h1>
                <p className="text-gray-500 mt-1">Gerencie todo o seu inventário em um só lugar.</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por modelo, placa ou marca..."
                            className="border border-gray-300 rounded-lg p-2 text-sm w-72 bg-white shadow-sm pl-10 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    </div>
                    
                    {/* FILTRO DE STATUS */}
                    <select 
                        className="border border-gray-300 rounded-lg p-2 text-sm bg-white shadow-sm text-gray-700 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="Todos">Status: Todos</option>
                        <option value="Disponível">Disponível</option>
                        <option value="Vendido">Vendido</option>
                        <option value="Em Manutenção">Em Manutenção</option>
                    </select>
                    
                    <select 
                        className="border border-gray-300 rounded-lg p-2 text-sm bg-white shadow-sm text-gray-700 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary"
                        value={filterMarca}
                        onChange={(e) => setFilterMarca(e.target.value)}
                    >
                        <option value="Todas">Marca: Todas</option>
                        {availableMarcas.map(marca => (
                            <option key={marca} value={marca}>{marca}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => openModal('add')}
                    className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-speedauto-primary-hover transition-all shadow-sm"
                >
                    <FaPlus /> Cadastrar Veículo
                </button>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">Veículo</th>
                            <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">Placa</th>
                            <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">Ano/Mod</th>
                            <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">Valor (R$)</th>
                            <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">Status</th>
                            <th className="p-4 text-center text-xs font-semibold uppercase text-gray-600">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map(veiculo => (
                                <tr key={veiculo.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <img src={`https://placehold.co/60x40/E2E8F0/1A202C?text=${veiculo.marca.toUpperCase()}`} alt={veiculo.modelo} className="w-16 h-10 object-cover rounded shadow-sm" />
                                        <div>
                                            <div className="font-semibold text-gray-800">{veiculo.marca} {veiculo.modelo}</div>
                                            <div className="text-xs text-gray-500">ID: {veiculo.id}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-700 font-mono">{veiculo.placa}</td>
                                    <td className="p-4 text-sm text-gray-700">{veiculo.ano}</td>
                                    <td className="p-4 text-sm text-gray-800 font-semibold">{formatCurrency(veiculo.valor_venda)}</td>
                                    <td className="p-4 text-sm">{renderStatusBadge(veiculo.status)}</td>

                                    <td className="p-4 text-sm">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openModal('view', veiculo)} title="Visualizar" className="p-2 rounded-full text-gray-400 hover:text-speedauto-primary hover:bg-gray-100 transition-all">
                                                <FaEye />
                                            </button>
                                            <button onClick={() => openModal('edit', veiculo)} title="Editar" className="p-2 rounded-full text-gray-400 hover:text-speedauto-primary hover:bg-gray-100 transition-all">
                                                <FaPencilAlt />
                                            </button>
                                            <button onClick={() => openModal('delete', veiculo)} title="Excluir" className="p-2 rounded-full text-gray-400 hover:text-speedauto-red hover:bg-red-50 transition-all">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <div className="text-center p-12">
                                        <FaCar className="mx-auto text-5xl text-gray-300" />
                                        <h3 className="mt-4 text-lg font-semibold text-gray-700">Nenhum veículo encontrado</h3>
                                        <p className="mt-1 text-sm text-gray-500">Ajuste os filtros ou o termo de pesquisa para encontrar veículos.</p>
                                        <button
                                            onClick={() => { setSearchTerm(''); setFilterStatus('Todos'); setFilterMarca('Todas'); }}
                                            className="mt-6 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto hover:bg-gray-300 transition-all"
                                        >
                                            Limpar Filtros
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalMode === 'view' && selectedVehicle && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <FaInfoCircle className='text-speedauto-primary' /> Detalhes do Veículo
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 p-1"><FaTimes size={20} /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">{selectedVehicle.marca} {selectedVehicle.modelo}</h3>
                            
                            <div className='grid grid-cols-2 gap-3'>
                                <div className="p-4 bg-speedauto-primary/10 rounded-lg border border-speedauto-primary/30 col-span-2">
                                    <p className="text-sm font-medium text-speedauto-primary">VALOR DE VENDA</p>
                                    <p className="text-3xl font-extrabold text-speedauto-primary mt-1">
                                        {formatCurrency(selectedVehicle.valor_venda)}
                                    </p>
                                </div>
                                
                                <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-between col-span-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">STATUS ATUAL</p>
                                        <div className="mt-1">{renderStatusBadge(selectedVehicle.status)}</div>
                                    </div>
                                    <FaClipboardCheck className='text-3xl text-gray-400' />
                                </div>

                                <DetailItem label="Placa" value={selectedVehicle.placa} icon={<FaCarSide />} />
                                <DetailItem label="Ano/Modelo" value={selectedVehicle.ano} icon={<FaCalendarAlt />} />
                                
                                <DetailItem label="Cor" value={selectedVehicle.cor || 'Não informado'} icon={<FaPalette />} />
                                <DetailItem label="Combustível" value={selectedVehicle.combustivel || 'Não informado'} icon={<FaGasPump />} />
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t rounded-b-lg flex justify-end gap-4">
                            <button 
                                onClick={() => openModal('edit', selectedVehicle)} 
                                className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
                            >
                                <FaPencilAlt className='inline-block mr-1' /> Editar Dados
                            </button>
                            <button onClick={closeModal} className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-speedauto-primary-hover transition-all">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(modalMode === 'add' || modalMode === 'edit') && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in-up"> 

                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">{modalMode === 'add' ? 'Cadastrar Novo Veículo' : 'Editar Veículo'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 p-1"><FaTimes size={20} /></button>
                        </div>

                        <form onSubmit={handleSaveVehicle}>
                            <div className="p-6 space-y-8">

                                <div className="border border-gray-200 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">1. Detalhes de Identificação</h3>
                                    <div className="grid grid-cols-3 gap-5">

                                        <div className="form-group">
                                            <label htmlFor="marca" className="block text-sm font-semibold mb-1 text-gray-700">Marca</label>
                                            <input type="text" name="marca" defaultValue={selectedVehicle?.marca}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: BMW" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="modelo" className="block text-sm font-semibold mb-1 text-gray-700">Modelo</label>
                                            <input type="text" name="modelo" defaultValue={selectedVehicle?.modelo}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: 320i" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="ano" className="block text-sm font-semibold mb-1 text-gray-700">Ano</label>
                                            <input type="number" name="ano" defaultValue={selectedVehicle?.ano}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: 2022" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="cor" className="block text-sm font-semibold mb-1 text-gray-700">Cor</label>
                                            <input type="text" name="cor" defaultValue={selectedVehicle?.cor}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: Preto" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="combustivel" className="block text-sm font-semibold mb-1 text-gray-700">Combustível</label>
                                            <input type="text" name="combustivel" defaultValue={selectedVehicle?.combustivel}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: Gasolina" />
                                        </div>

                                    </div>
                                </div>

                                <div className="border border-gray-200 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">2. Dados de Estoque e Venda</h3>
                                    <div className="grid grid-cols-3 gap-5">

                                        <div className="form-group">
                                            <label htmlFor="placa" className="block text-sm font-semibold mb-1 text-gray-700">Placa</label>
                                            <input type="text" name="placa" value={placa} onChange={(e) => setPlaca(formatPlate(e.target.value))} defaultValue={selectedVehicle?.placa}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: RTA-4G55" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="valor" className="block text-sm font-semibold mb-1 text-gray-700">Valor de Venda (R$)</label>
                                            <input type="number" step="0.01" name="valor" defaultValue={selectedVehicle?.valor_venda}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                                placeholder="Ex: 150000.00" required />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="status" className="block text-sm font-semibold mb-1 text-gray-700">Status no Estoque</label>
                                            <select name="status" defaultValue={selectedVehicle?.status ?? 'Disponível'}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" required>
                                                <option value="Disponível">Disponível</option>
                                                <option value="Vendido">Vendido</option>
                                                <option value="Em Manutenção">Em Manutenção</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t rounded-b-lg flex justify-end gap-4">
                                <button type="button" onClick={closeModal} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-speedauto-primary-hover transition-all">
                                    {modalMode === 'add' ? <FaPlus size={14} className="inline-block mr-2" /> : <FaPencilAlt size={14} className="inline-block mr-2" />}
                                    {modalMode === 'add' ? 'Cadastrar' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {modalMode === 'delete' && selectedVehicle && (
                <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800">Excluir Veículo</h2>
                            <p className="text-gray-600 mt-4">
                                Tem certeza que deseja excluir o veículo <strong>{selectedVehicle.marca} {selectedVehicle.modelo}</strong> (Placa: {selectedVehicle.placa})?
                            </p>
                            <p className="text-gray-600 mt-2">Esta ação não pode ser desfeita.</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-4">
                            <button type="button" onClick={closeModal} className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleDeleteVehicle} className="bg-speedauto-red text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all">
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}