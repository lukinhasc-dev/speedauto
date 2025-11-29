import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { useEffect } from "react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    autoCloseDuration?: number; // em milissegundos
}

export default function SuccessModal({
    isOpen,
    onClose,
    title = "Sucesso!",
    message = "Operação realizada com sucesso!",
    autoCloseDuration = 3000
}: SuccessModalProps) {

    // Auto-close após o tempo definido
    useEffect(() => {
        if (isOpen && autoCloseDuration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, autoCloseDuration, onClose]);

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
                    {/* Glow superior decorativo verde */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-500 opacity-10 blur-3xl rounded-full"></div>

                    {/* Botão fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-green-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Fechar"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>

                    <div className="p-6 sm:p-8">

                        {/* Ícone de sucesso animado */}
                        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-5 animate-bounce">
                            <IoCheckmarkCircle className="h-12 w-12 text-green-600" />
                        </div>

                        {/* Título */}
                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center mb-3">
                            {title}
                        </h3>

                        {/* Mensagem */}
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Botão OK */}
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md"
                        >
                            OK, Entendi!
                        </button>

                    </div>
                </div>
            </div>
        </>
    );
}
