// src/components/Header.tsx
import { FaSearch, FaBell } from 'react-icons/fa';

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 flex items-center justify-between px-6 py-3">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Pesquisar por placa, cliente, modelo..."
                    className="bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-4 w-96 text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex items-center gap-5">
                <FaBell className="text-gray-600 text-xl cursor-pointer" />

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
