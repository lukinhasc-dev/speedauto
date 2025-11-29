import React, { useState, useEffect, type FormEvent } from 'react';
import { FaUser, FaLock, FaUpload, FaTrash, FaCheckCircle, FaCamera } from 'react-icons/fa';
import * as authApi from '../api/authApi';
import RemovePhotoConfirm from '../components/RemovePhotoConfirm';
import SuccessModal from '../components/SuccessModal';

// --- Interfaces ---
interface UserProfile {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    foto: string | null;
}


export default function Configuracoes() {
    const [activeTab, setActiveTab] = useState<'perfil' | 'seguranca'>('perfil');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [photoInput, setPhotoInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });

    // Carrega os dados do usuário do localStorage ao montar o componente
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                setProfile(userData);
                setPhotoInput(userData.foto || '');
            } catch (err) {
                console.error('Erro ao carregar dados do usuário:', err);
            }
        }
    }, []);


    // --- Handlers ---
    const handlePhotoUpload = async () => {
        if (!photoInput || photoInput.trim() === '') {
            alert('Por favor, insira uma URL de imagem válida ou faça upload de um arquivo.');
            return;
        }

        if (!profile) {
            alert('Usuário não encontrado. Por favor, faça login novamente.');
            return;
        }

        setUploading(true);
        try {
            // Atualiza o estado local e o localStorage
            const updatedProfile = { ...profile, foto: photoInput };
            setProfile(updatedProfile);
            localStorage.setItem('user', JSON.stringify(updatedProfile));

            // Mostra modal de sucesso
            setSuccessMessage({
                title: '✅ Foto Atualizada!',
                message: 'Sua foto de perfil foi atualizada com sucesso e já está visível em todo o sistema.'
            });
            setShowSuccessModal(true);
        } catch (err: any) {
            console.error('Erro ao atualizar foto:', err);
            alert(`Erro ao atualizar foto: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
        } finally {
            setUploading(false);
        }
    };

    const confirmRemovePhoto = async () => {
        if (!profile) {
            alert('Usuário não encontrado.');
            return;
        }

        setShowRemoveModal(false); // Fecha o modal antes de prosseguir

        setUploading(true);
        try {
            await authApi.updatePhoto(profile.id, '');

            // Atualiza o estado local e o localStorage
            const updatedProfile = { ...profile, foto: null };
            setProfile(updatedProfile);
            setPhotoInput('');
            localStorage.setItem('user', JSON.stringify(updatedProfile));

            // Mostra modal de sucesso
            setSuccessMessage({
                title: '🗑️ Foto Removida!',
                message: 'Sua foto de perfil foi removida com sucesso. Você pode adicionar uma nova a qualquer momento.'
            });
            setShowSuccessModal(true);
        } catch (err: any) {
            console.error('Erro ao remover foto:', err);
            alert(`Erro ao remover foto: ${err.response?.data?.message || err.message || 'Erro desconhecido'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validação de tamanho (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Arquivo muito grande! Por favor, escolha uma imagem menor que 5MB.');
                return;
            }

            // Converte para base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoInput(reader.result as string);
            };
            reader.onerror = () => {
                alert('Erro ao ler o arquivo. Por favor, tente novamente.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const currentPass = formData.get('senha-atual');
        const newPass = formData.get('nova-senha');
        const confirmPass = formData.get('confirmar-senha');

        if (newPass !== confirmPass) {
            alert('As senhas não coincidem!');
            return;
        }

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
                </div>

                {/* Conteúdo das abas */}
                <div className="min-h-[500px]">

                    {/* ---PERFIL --- */}
                    {activeTab === 'perfil' && (
                        <div className="p-6 space-y-8">

                            {/*Avatar */}
                            <div className="border border-gray-200 p-6 rounded-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Avatar e Foto</h3>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="relative">
                                        {profile?.foto ? (
                                            <img src={profile.foto} alt="Avatar" className="w-24 h-24 rounded-full shadow-md object-cover border-2 border-gray-200" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full shadow-md bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                                <FaCamera className="text-gray-400 text-3xl" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3 w-full">
                                        <label className="block text-sm font-semibold text-gray-700">Opção 1: Upload do Computador</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-speedauto-primary file:text-white hover:file:bg-speedauto-primary-hover"
                                        />

                                        <label className="block text-sm font-semibold text-gray-700 mt-4">Opção 2: URL da Imagem</label>
                                        <input
                                            type="text"
                                            value={photoInput}
                                            onChange={(e) => setPhotoInput(e.target.value)}
                                            placeholder="Cole a URL da sua foto aqui..."
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={handlePhotoUpload}
                                                disabled={uploading}
                                                className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-speedauto-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaUpload /> {uploading ? 'Salvando...' : 'Salvar Foto'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowRemoveModal(true)}
                                                disabled={uploading || !profile?.foto}
                                                className="text-speedauto-red font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-all border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <FaTrash /> Remover
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            💡 Dica: Escolha fazer upload do seu computador ou colar uma URL de serviços como <a href="https://imgur.com/" target="_blank" rel="noreferrer" className="text-speedauto-primary underline">Imgur</a>.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/*Informações Pessoais */}
                            <div className="border border-gray-200 p-6 rounded-lg">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Informações Pessoais</h3>
                                <p className="text-sm text-gray-500 mb-4">Esses dados foram definidos durante o cadastro e não podem ser alterados aqui.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div className="form-group">
                                        <label htmlFor="nome" className="block text-sm font-semibold mb-1 text-gray-700">Nome Completo</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={profile?.nome || ''}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-not-allowed text-gray-600"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">E-mail</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profile?.email || ''}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-not-allowed text-gray-600"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="telefone" className="block text-sm font-semibold mb-1 text-gray-700">Telefone</label>
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={profile?.telefone || ''}
                                            readOnly
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-gray-50 cursor-not-allowed text-gray-600"
                                        />
                                    </div>

                                </div>
                            </div>

                        </div>
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

                </div>
            </div>

            {/* Modal de confirmação de remoção */}
            <RemovePhotoConfirm
                isOpen={showRemoveModal}
                onClose={() => setShowRemoveModal(false)}
                onConfirm={confirmRemovePhoto}
                previewUrl={profile?.foto || undefined}
                title="Remover Foto de Perfil"
                message="Tem certeza que deseja remover sua foto de perfil? Você poderá adicionar uma nova a qualquer momento."
            />

            {/* Modal de sucesso */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title={successMessage.title}
                message={successMessage.message}
                autoCloseDuration={3000}
            />
        </>
    );
}