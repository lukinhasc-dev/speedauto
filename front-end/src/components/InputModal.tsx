import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value: string) => void;
    title?: string;
    placeholder?: string;
    confirmButtonText?: string;
}

export default function InputModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Digite o valor",
    placeholder = "Digite aqui...",
    confirmButtonText = "Confirmar"
}: InputModalProps) {
    const [inputValue, setInputValue] = useState('');

    // Limpa o input quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (inputValue.trim()) {
            onConfirm(inputValue.trim());
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleConfirm();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 transition-opacity duration-300 ease-out animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all duration-300 ease-out animate-scaleIn relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glow superior decorativo */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500 opacity-10 blur-3xl rounded-full"></div>

                    {/* Botão fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Fechar"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>

                    <div className="p-6 sm:p-8">
                        {/* Título */}
                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6">
                            {title}
                        </h3>

                        {/* Input */}
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={placeholder}
                            autoFocus
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 placeholder-gray-400 mb-6"
                        />

                        {/* Botões */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!inputValue.trim()}
                                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {confirmButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
