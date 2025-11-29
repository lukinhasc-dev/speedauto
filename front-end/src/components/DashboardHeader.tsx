import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

interface UserData {
  id: number;
  nome: string | null;
  email: string;
  telefone: string;
  foto: string | null;
}

export default function DashboardHeader() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      setUserData(user);
    } catch (err) {
      console.error('Erro ao carregar dados do usuário:', err);
    }
  }, []);

  // Tratamento seguro
  const getFirstName = (fullName?: string | null) => {
    if (!fullName || typeof fullName !== 'string') return 'Usuário';

    const parts = fullName.trim().split(' ').filter(Boolean);
    return parts.length > 0 ? parts[0] : 'Usuário';
  };

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-end px-6 py-3">
      <div className="flex items-center gap-5">
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
            Olá, {getFirstName(userData?.nome)}!
          </span>
        </div>
      </div>
    </header>
  );
}
