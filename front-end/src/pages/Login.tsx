import { useNavigate } from 'react-router-dom';
import Assets from '../assets/Logo Completa - SpeedAuto.png';

export default function Login() {
  const navigate = useNavigate();

  const entrar = () => {
    navigate("/pagina-inicial");
  }

  const esqueciSenha = () => {
    navigate("/esqueci-senha");
  }

  return (
    <div className='flex h-full w-full'>
      <div className='bg-[#162334] flex flex-col justify-center items-center h-screen w-screen'>
        <img src={Assets} alt="Logo SpeedAuto" className='w-44 mb-10' />


        {/*Card*/}
        <div className='bg-white rounded-lg shadow-lg p-10 flex flex-col justify-center items-center w-auto h-auto'>
          <h1 className='font-bold font-poppins text-2xl'>Seja bem-vindo!</h1>
          <p className='font-poppins text-1xl mt-1'>Gerencie seus veículos, vendas e clientes.</p>


          {/*Forms*/}
          <form className='flex flex-col mt-3 w-full h-full'>
            <label htmlFor="email" className='mb-1 mt-3 font-semibold'>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Insira seu Email"
              className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-3 outline-none'
            />
            <label htmlFor="passsword" className='mb-1 mt-3 font-semibold'>Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Insira sua Senha"
              className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-2 outline-none'
            />
            <button onClick={entrar} className='bg-[#1f52dc] text-white rounded-lg p-2 font-semibold mt-10'>Entrar</button>
            <a onClick={esqueciSenha} className='text-center font-poppins text-1xl text-[#1f52dc] mt-5 font-semibold cursor-pointer'>Esqueceu a senha?</a>
          </form>
        </div>

      </div>
    </div>
  )
}
