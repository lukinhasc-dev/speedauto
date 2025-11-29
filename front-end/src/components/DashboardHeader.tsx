import { useState, useEffect } from 'react';
import { FaBell, FaUser } from 'react-icons/fa';

interface UserData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  foto: string | null;
}

export default function DashboardHeader() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Carrega dados do usuário do localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserData(user);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    }
  }, []);

  // Pega apenas o primeiro nome
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-end px-6 py-3">
      <div className="flex items-center gap-5">
        <FaBell className="text-gray-500 text-xl cursor-pointer hover:text-speedauto-primary transition-colors" />
        <div className="flex items-center gap-3">
          {userData?.foto ? (
            <img
              src={userData.foto}
              alt="Avatar do usuário"
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
              <FaUser className="text-gray-400 text-sm" />
            </div>
          )}
          <span className="font-semibold text-gray-800">
            Olá, {userData ? getFirstName(userData.nome) : 'Usuário'}!
          </span>
        </div>
      </div>
    </header>
  );
}