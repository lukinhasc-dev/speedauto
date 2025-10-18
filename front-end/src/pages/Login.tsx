import Assets from '../assets/Carro - Speedauto.png';

export default function Login() {
  return (
    <div className='bg-blue-950 flex flex-col justify-center items-center h-screen w-screen'>

      {/*Card*/}
      <div className='bg-white rounded-lg shadow-lg p-8 flex flex-col justify-center items-center gap-2'>
        <img src={Assets} alt="SpeedAuto" className='flex justify-center items-center w-10 h-15' />
        <h1 className='font-bold font-poppins text-2xl'>Bem-vindo de volta!</h1>
        <p className='font-poppins text-1xl'>Gerencie seus veículos, vendas e clientes.</p>


        {/*Forms*/}
        <form className='flex flex-col gap-0 mt-3'>
          <label htmlFor="email" className=''>Email</label>
          <input
            type="email"
            id="email"
            placeholder="Insira seu Email"
            className='border border-gray-300 rounded-lg p-2'
          />
          <label htmlFor="passsword">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Insira sua Senha"
            className='border border-gray-300 rounded-lg p-2'
          />
          <button className='bg-blue-950 text-white rounded-lg p-2'>Entrar</button>
        </form>
      </div>




    </div>
  )
}
