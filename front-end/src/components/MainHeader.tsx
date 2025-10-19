// src/components/MainHeader.tsx
import { FaBell } from 'react-icons/fa';

export default function MainHeader() {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-end px-6 py-3">
      <div className="flex-grow"></div>

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