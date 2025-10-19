import React from 'react'; 
import { useNavigate } from 'react-router-dom';
import Assets from '../assets/Logo Completa - SpeedAuto.png';

export default function ForgotPassword() {
    const navigate = useNavigate();

    //Usar o onSubmit do formulário
    const handleReset = (e: React.FormEvent) => {
        e.preventDefault(); // Impede o recarregamento da página
        
        //Lógica correta: simula o envio e volta ao Login
        alert("Se uma conta com este e-mail existir, um link de recuperação foi enviado.");
        navigate("/"); 
    }

    return (
        <div className='flex h-full w-full'>
            <div className='bg-speedauto-sidebar flex flex-col justify-center items-center h-screen w-screen'>
                <img src={Assets} alt="Logo SpeedAuto" className='w-44 mb-10' />

                <div className='bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center items-center w-full max-w-md'>
                    <h1 className='font-bold font-poppins text-2xl'>Esqueceu sua senha?</h1>
                    <p className='font-poppins text-center text-1xl mt-1 text-gray-600'>Insira seu email para recuperar sua senha.</p>

                    <form className='flex flex-col mt-3 w-full' onSubmit={handleReset}>
                        <label htmlFor="email" className='mb-1 mt-3 font-semibold'>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Insira seu Email"
                            className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-3 outline-none'
                            required
                        />
                        
                        <button 
                            type="submit" 
                            className='bg-speedauto-primary text-white rounded-lg p-2 font-semibold mt-10 hover:bg-speedauto-primary-hover transition-all'
                        >
                            Enviar Link de Recuperação
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => navigate("/")} 
                            className='text-center font-poppins text-1xl text-speedauto-primary mt-5 font-semibold cursor-pointer'
                        >
                            Voltar para o Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}