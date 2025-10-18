import Assets from '../assets/Carro - Speedauto.png';

export default function Login() {
  return (
    <div className='bg-blue-950 flex flex-col justify-center items-center h-screen w-screen'>

      {/*Card*/}
      <div className='bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center w-auto h-auto'>
        <img src={Assets} alt="SpeedAuto" className='flex justify-center items-center w-10 h-15' />
        <h1 className='font-bold font-poppins text-2xl'>Seja bem-vindo!</h1>
        <p className='font-poppins text-1xl'>Gerencie seus veículos, vendas e clientes.</p>


        {/*Forms*/}
        <form className='flex flex-col gap-0 mt-3'>
          <label htmlFor="email" className='mb-2 mt-3'>Email</label>
          <input
            type="email"
            id="email"
            placeholder="Insira seu Email"
            className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-2'
          />
          <label htmlFor="passsword" className='mb-2 mt-3'>Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Insira sua Senha"
            className='border bg-[#EDF2F7] border-gray-200 rounded-lg p-2 font-poppins mb-2'
          />
          <button className='bg-[#1f52dc] text-white rounded-lg p-2 font-semibold mt-10'>Entrar</button>
        </form>
      </div>




    </div>
  )
}
