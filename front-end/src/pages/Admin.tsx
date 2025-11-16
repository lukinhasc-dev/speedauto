import React, { useState } from 'react';
import { register } from '../api/authApi';
import Assets from '../assets/Logo Completa - SpeedAuto.png';


export default function AdminCadastrarUsuario() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      await register(email, senha);
      setMensagem('Usuário cadastrado com sucesso!');
      setEmail('');
      setSenha('');
    } catch (err: unknown) {
      console.error(err);
      setMensagem('Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-full w-full'>
      <div className='bg-speedauto-sidebar flex flex-col justify-center items-center h-screen w-screen'>
        <img src={Assets} alt="Logo SpeedAuto" className='w-44 mb-10' />

        <div className='bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center items-center w-full max-w-md'>
          <h1 className='font-bold font-poppins text-2xl mb-1'>Painel Admin</h1>
          <p className='font-poppins text-1xl mb-4'>Cadastrar novo usuário do sistema</p>

          <form onSubmit={handleSubmit} className='flex flex-col mt-3 w-full h-full'>
            <label htmlFor="email" className='mb-1 mt-3 font-semibold'>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Insira o Email"
              className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-3 outline-none'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password" className='mb-1 mt-3 font-semibold'>Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Insira a Senha"
              className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-2 outline-none'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            {mensagem && (
              <p className='text-center text-sm mt-2 text-gray-700'>{mensagem}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className='bg-speedauto-primary text-white rounded-lg p-2 font-semibold mt-10 hover:bg-speedauto-primary-hover transition-all'
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

}
