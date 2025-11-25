// src/components/Sidebar.tsx
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaCar, FaDollarSign, FaUsers, FaChartPie, FaCog, FaCarSide, FaSignOutAlt,
} from 'react-icons/fa';
import { FaMoneyBill1Wave } from 'react-icons/fa6';
import CardConfirm from '../components/CardConfirm';

export default function Sidebar() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 py-3 px-3 rounded-lg text-gray-400 font-medium transition-all
     ${isActive
      ? 'bg-white/10 text-white'
      : 'hover:bg-white/5 hover:text-white'
    }`;

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    navigate('/');
  };

  const handleCloseModal = () => {
    setIsConfirmOpen(false);
  };

  return (
    <aside className="bg-speedauto-sidebar text-gray-400 p-6 flex flex-col h-screen">

      <div className="flex items-center gap-2 text-white text-2xl font-bold mb-12">
        <FaCarSide className="text-speedauto-red" />
        <span>SPEEDAUTO</span>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          <li><NavLink to="/dashboard" className={navLinkClass}><FaTachometerAlt /> Dashboard</NavLink></li>
          <li><NavLink to="/veiculos" className={navLinkClass}><FaCar /> Veículos</NavLink></li>
          <li><NavLink to="/vendas" className={navLinkClass}><FaDollarSign /> Vendas</NavLink></li>
          <li><NavLink to="/clientes" className={navLinkClass}><FaUsers /> Clientes</NavLink></li>
          <li><NavLink to="/financiamento" className={navLinkClass}><FaMoneyBill1Wave /> Financiamento</NavLink></li>
          <li><NavLink to="/relatorios" className={navLinkClass}><FaChartPie /> Relatórios</NavLink></li>
          <li><NavLink to="/configuracoes" className={navLinkClass}><FaCog /> Configurações</NavLink></li>
        </ul>
      </nav>

      <div className="mt-auto">
        <button 
          onClick={handleLogoutClick}
          className="flex items-center gap-3 py-3 px-3 rounded-lg text-gray-400 font-medium transition-all hover:bg-white/5 hover:text-white w-full"
        >
          <FaSignOutAlt /> Sair
        </button>
      </div>

      <CardConfirm
        isOpen={isConfirmOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title='Sair do sistema?'
        message="Você precisará fazer login novamente para acessar sua conta."
        confirmText="Sim, sair"
        cancelText="Cancelar"
        type="danger"
      />
    </aside>
  );
}