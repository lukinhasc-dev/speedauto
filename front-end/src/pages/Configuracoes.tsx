import React, { useState, type FormEvent} from 'react';
import { FaUser, FaLock, FaBell, FaSave, FaUpload, FaTrash, FaCheckCircle } from 'react-icons/fa';

// --- Interfaces ---
interface UserProfile {
    nome: string;
    email: string;
    telefone: string;
    avatarUrl: string;
}

// --- Componente Toggle (Switch) Reutilizável ---
interface ToggleProps {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleProps> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
        <div className="max-w-md">
            <h3 className="text-sm font-semibold text-gray-800">{label}</h3>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-speedauto-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-speedauto-primary"></div>
        </label>
    </div>
);


export default function Configuracoes() {
    const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca' | 'notificacoes'>('perfil');
    
    // --- ESTADOS MOCKADOS DO USUÁRIO ---
    const [profile, setProfile] = useState<UserProfile>({
        nome: 'Usuário Principal',
        email: 'usuario@speedauto.com',
        telefone: '(11) 91234-5678',
        avatarUrl: 'https://i.pravatar.cc/150',
    });
    const [notifications, setNotifications] = useState({
        emailLeads: true,
        emailVendas: true,
        resumoDiario: false,
    });


    // --- Handlers ---
    const handleProfileSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Perfil atualizado com sucesso! (Simulação)');
        // Lógica de envio para o backend sera implementado aq
    };

    const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const currentPass = formData.get('senha-atual');
        const newPass = formData.get('nova-senha');

        if (currentPass === newPass) {
            alert('A nova senha deve ser diferente da atual!');
            return;
        }

        if (String(newPass).length < 6) {
             alert('A nova senha deve ter pelo menos 6 caracteres.');
             return;
        }

        alert('Senha alterada com sucesso! (Simulação)');
        e.currentTarget.reset(); // Limpa o formulário
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };


    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>
                <p className="text-gray-500 mt-1">Gerencie seu perfil, segurança e preferências do sistema.</p>
            </div>

            <div className="bg-white rounded-lg shadow-xl border border-gray-200">
                
                {/* Navegação por abas */}
                <div className="flex border-b border-gray-200 p-2">
                    <button
                        onClick={() => setActiveTab('perfil')}
                        className={`py-3 px-6 text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'perfil' ? 'text-speedauto-primary border-b-2 border-speedauto-primary' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <FaUser /> Perfil
                    </button>
                    <button
                        onClick={() => setActiveTab('seguranca')}
                        className={`py-3 px-6 text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'seguranca' ? 'text-speedauto-primary border-b-2 border-speedauto-primary' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <FaLock /> Segurança
                    </button>
                    <button
                        onClick={() => setActiveTab('notificacoes')}
                        className={`py-3 px-6 text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'notificacoes' ? 'text-speedauto-primary border-b-2 border-speedauto-primary' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <FaBell /> Notificações
                    </button>
                </div>

                {/* Conteúdo das abas */}
                <div className="min-h-[500px]">

                    {/* ---PERFIL --- */}
                    {activeTab === 'perfil' && (
                        <form onSubmit={handleProfileSubmit}>
                            <div className="p-6 space-y-8">
                                
                                {/*Avatar */}
                                <div className="border border-gray-200 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Avatar e Foto</h3>
                                    <div className="flex items-center gap-6">
                                        <img src={profile.avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full shadow-md" />
                                        <div className="flex gap-3">
                                            <button type="button" className="bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-all">
                                                <FaUpload /> Carregar Nova
                                            </button>
                                            <button type="button" className="text-speedauto-red font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-all border border-red-100">
                                                <FaTrash /> Remover
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/*Informações Pessoais */}
                                <div className="border border-gray-200 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Informações Pessoais</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        
                                        <div className="form-group">
                                            <label htmlFor="nome" className="block text-sm font-semibold mb-1 text-gray-700">Nome Completo</label>
                                            <input type="text" name="nome" defaultValue={profile.nome} onChange={(e) => setProfile({...profile, nome: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" required />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">E-mail</label>
                                            <input type="email" name="email" defaultValue={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" required />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="telefone" className="block text-sm font-semibold mb-1 text-gray-700">Telefone</label>
                                            <input type="text" name="telefone" defaultValue={profile.telefone} onChange={(e) => setProfile({...profile, telefone: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" />
                                        </div>

                                    </div>
                                </div>

                            </div>
                            
                            {/* Rodapé save*/}
                            <div className="p-4 bg-gray-50 border-t rounded-b-lg flex justify-end">
                                <button type="submit" className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-speedauto-primary-hover transition-all shadow-md">
                                    <FaSave /> Salvar
                                </button>
                            </div>
                        </form>
                    )}

                    {/* --- SEGURANÇA --- */}
                    {activeTab === 'seguranca' && (
                         <form onSubmit={handlePasswordSubmit}>
                            <div className="p-6 space-y-8">

                                <div className="border border-gray-200 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Alterar Senha</h3>
                                    <p className="text-sm text-gray-500 mb-6">Mantenha sua conta segura usando uma senha forte e única.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group md:col-span-2">
                                            <label htmlFor="senha-atual" className="block text-sm font-semibold mb-1 text-gray-700">Senha Atual</label>
                                            <input type="password" name="senha-atual" placeholder='••••••' required
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="nova-senha" className="block text-sm font-semibold mb-1 text-gray-700">Nova Senha</label>
                                            <input type="password" name="nova-senha" placeholder='••••••' required
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="confirmar-senha" className="block text-sm font-semibold mb-1 text-gray-700">Confirmar Nova Senha</label>
                                            <input type="password" name="confirmar-senha" placeholder='••••••' required
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border border-gray-200 p-6 rounded-lg">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Autenticação de Dois Fatores</h3>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600 max-w-lg">
                                            Adicione uma camada extra de segurança à sua conta exigindo um código SMS ou TOTP no login.
                                        </p>
                                        <button type='button' className="bg-speedauto-green text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-all shadow-md">
                                            <FaCheckCircle /> Ativado
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t rounded-b-lg flex justify-end">
                                <button type="submit" className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-speedauto-primary-hover transition-all shadow-md">
                                    <FaLock /> Atualizar Senha
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ---NOTIFICAÇÕES --- */}
                    {activeTab === 'notificacoes' && (
                        <div className="p-6 space-y-8">
                            <div className="border border-gray-200 p-6 rounded-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Notificações por E-mail</h3>
                                <p className="text-sm text-gray-500 mb-4">Escolha quais atualizações de sistema você deseja receber.</p>
                                
                                <ToggleSwitch 
                                    label="Novos Leads" 
                                    description="Receber um alerta imediato quando um novo lead ou contato entrar no CRM."
                                    checked={notifications.emailLeads}
                                    onChange={() => handleNotificationToggle('emailLeads')}
                                />
                                <ToggleSwitch 
                                    label="Vendas Concluídas" 
                                    description="Receber uma confirmação sempre que uma transação for marcada como 'Concluída'."
                                    checked={notifications.emailVendas}
                                    onChange={() => handleNotificationToggle('emailVendas')}
                                />
                                <ToggleSwitch 
                                    label="Resumo Diário de Atividades" 
                                    description="Receber um e-mail consolidado no final do dia com as estatísticas."
                                    checked={notifications.resumoDiario}
                                    onChange={() => handleNotificationToggle('resumoDiario')}
                                />

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}