import { IoWarningOutline, IoClose } from "react-icons/io5";

interface CardConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "warning" | "danger" | "info" | "success";
}

export default function CardConfirm({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Ação",
    message = "Tem certeza que deseja continuar?",
    confirmText = "Sim, confirmar",
    cancelText = "Cancelar",
    type = "warning"

}: CardConfirmProps) {
    if (!isOpen) return null;

    const typeStyles = {
        warning: {
            icon: "text-yellow-500",
            iconBg: "bg-yellow-100",
            button: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
        },
        danger: {
            icon: "text-red-500",
            iconBg: "bg-red-100",
            button: "bg-red-500 hover:bg-red-600 focus:ring-red-500"
        },
        info: {
            icon: "text-blue-500",
            iconBg: "bg-blue-100",
            button: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
        },
        success: {
            icon: "text-green-500",
            iconBg: "bg-green-100",
            button: "bg-green-500 hover:bg-green-600 focus:ring-green-500"
        }
    };

    const currentStyle = typeStyles[type];

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <>
            
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-out animate-fadeIn"
                onClick={onClose}
            />

            
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all duration-300 ease-out animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                   
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Fechar"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>

                    
                    <div className="p-6 sm:p-8">
                       
                        <div className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full ${currentStyle.iconBg} mb-4`}>
                            <IoWarningOutline className={`h-8 w-8 ${currentStyle.icon}`} />
                        </div>

                       
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-3">
                            {title}
                        </h3>

                       
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 leading-relaxed">
                            {message}
                        </p>

                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            
                            <button
                                onClick={onClose}
                                className="w-full sm:w-1/2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                {cancelText}
                            </button>

                           
                            <button
                                onClick={handleConfirm}
                                className={`w-full sm:w-1/2 px-4 py-3 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${currentStyle.button}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}