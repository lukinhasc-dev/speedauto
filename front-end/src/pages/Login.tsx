// src/pages/Login.tsx (Revisado)
import { useNavigate } from 'react-router-dom';
import Assets from '../assets/Logo Completa - SpeedAuto.png';
import React from 'react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  }

  const handleEsqueciSenha = () => {
    navigate("/esqueci-senha");
  }

  return (
    <div className='flex h-full w-full'>
      <div className='bg-speedauto-sidebar flex flex-col justify-center items-center h-screen w-screen'>
        <img src={Assets} alt="Logo SpeedAuto" className='w-44 mb-10' />


        <div className='bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center items-center w-full max-w-md'>
          <h1 className='font-bold font-poppins text-2xl'>Seja bem-vindo!</h1>
          <p className='font-poppins text-1xl mt-1'>Gerencie seus veículos, vendas e clientes.</p>

          <form className='flex flex-col mt-3 w-full h-full' onSubmit={handleLogin}>
            <label htmlFor="email" className='mb-1 mt-3 font-semibold'>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Insira seu Email"
              className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-3 outline-none'
              required
            />
            <label htmlFor="password" className='mb-1 mt-3 font-semibold'>Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Insira sua Senha"
              className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-2 outline-none'
              required
            />

            <button
              type="submit"
              className='bg-speedauto-primary text-white rounded-lg p-2 font-semibold mt-10 hover:bg-speedauto-primary-hover transition-all'
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={handleEsqueciSenha}
              className='text-center font-poppins text-1xl text-speedauto-primary mt-5 font-semibold cursor-pointer'
            >
              Esqueceu a senha?
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}