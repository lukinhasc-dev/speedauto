import Assets from '../assets/Logo Completa - SpeedAuto.png';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();

    const confirmarEmail = () => {
        navigate("/pagina-inicial");
    }

    return (
        <div className='flex h-full w-full'>
            <div className='bg-[#162334] flex flex-col justify-center items-center h-screen w-screen'>
                <img src={Assets} alt="Logo SpeedAuto" className='w-44 mb-10' />


                {/*Card*/}
                <div className='bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center items-center w-auto h-auto'>
                    <h1 className='font-bold font-poppins text-2xl'>Esqueceu sua senha?</h1>
                    <p className='font-poppins text-1xl mt-1'>Insira seu email para recuperar sua senha.</p>


                    {/*Forms*/}
                    <form className='flex flex-col mt-3 w-full h-full'>
                        <label htmlFor="email" className='mb-1 mt-3 font-semibold'>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Insira seu Email"
                            className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-3 outline-none'
                        />
                        <label htmlFor="passsword" className='mb-1 mt-3 font-semibold'>Confirmar Email</label>
                        <input
                            type="email"
                            id="confirm-email"
                            placeholder="Confirme seu Email"
                            className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-2 outline-none'
                        />
                        <button onClick={confirmarEmail} className='bg-[#1f52dc] text-white rounded-lg p-2 font-semibold mt-10'>Entrar</button>
                    </form>
                </div>

            </div>
        </div>
    )
}
