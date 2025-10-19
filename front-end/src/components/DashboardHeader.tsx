import { useState } from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';

export default function DashboardHeader() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      alert(`Simulando busca global por: "${searchTerm}"`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
      <div className="relative flex-grow max-w-lg mr-8">
        <input
          type="text"
          placeholder="Pesquisar globalmente por placa, cliente, modelo..."
          className="bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-4 w-full text-sm focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={handleSearch} />
      </div>

      <div className="flex items-center gap-5">
        <FaBell className="text-gray-500 text-xl cursor-pointer" />
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/36"
            alt="Avatar do usuário"
            className="w-9 h-9 rounded-full"
          />
          <span className="font-semibold text-gray-800">Olá, Usuário</span>
        </div>
      </div>
    </header>
  );
}