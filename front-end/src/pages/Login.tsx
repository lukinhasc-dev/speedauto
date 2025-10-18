export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Login
        </h1>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuário"
            className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            className="p-3 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition py-2 rounded text-white font-semibold"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
