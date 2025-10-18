import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaCar, FaDollarSign, FaUsers, FaChartPie, FaCog, FaCarSide, FaSignOutAlt } from 'react-icons/fa'

export default function Sidebar() {
    const navLinkClass = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 py-3 px-3 rounded-1g text-gray-400 font-medium transition-all
    ${isActive
            ? 'bg-white/10 text-while'
            : 'hover:bg-white/5 hover:text-white'
        }`;

    return (
        <aside className="bg-speedauto-sidebar text-gray-400 p-6 flex flex-col h-screen">
            <div className="flex items-center gap-2 text-white text-2xl font-bold mb-12">
                <FaCarSide className="text-speedauto-red" />
                <span>SPEEDAUTO</span>
            </div>

            <nav className="flex-grow">
                <ul className="space-y-2">
                    <li><NavLink to="/dashboard" className={navLinkClass}><FaTachometerAlt />Dashboard</NavLink></li>
                    <li><NavLink to="/veiculos" className={navLinkClass}><FaCar />Veículos</NavLink></li>
                    <li><NavLink to="/vendas" className={navLinkClass}><FaDollarSign />Vendas</NavLink></li>
                    <li><NavLink to="/clientes" className={navLinkClass}><FaUsers />Clientes</NavLink></li>
                    <li><NavLink to="/relatorios" className={navLinkClass}><FaChartPie />Clientes</NavLink></li>
                    <li><NavLink to="/configuracoes" className={navLinkClass}><FaCog />Configurações</NavLink></li>
                </ul>
            </nav>

            <div className="mt-auto">
                <NavLink to="/login" className={navLinkClass}>
                    <FaSignOutAlt />Sair
                </NavLink>
            </div>
        </aside>
    );
<<<<<<< HEAD
=======
<<<<<<< HEAD

=======
>>>>>>> c097c3f (Criação e implementação d funções sidebar)
>>>>>>> ca2b43c9d8683e76585fbb5a06bcb4cc6b4ff426
}