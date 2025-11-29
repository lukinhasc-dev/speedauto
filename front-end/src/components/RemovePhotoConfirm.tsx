import { IoClose, IoTrashBin } from "react-icons/io5";

interface RemovePhotoConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    previewUrl?: string;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export default function RemovePhotoConfirm({
    isOpen,
    onClose,
    onConfirm,
    previewUrl,
    title = "Remover Foto",
    message = "Tem certeza que deseja remover esta foto? Essa ação não poderá ser desfeita.",
    confirmText = "Sim, remover",
    cancelText = "Cancelar"
}: RemovePhotoConfirmProps) {

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all duration-300 ease-out animate-scaleIn relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Glow superior decorativo */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500 opacity-10 blur-3xl rounded-full"></div>

                    {/* Botão fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                        aria-label="Fechar"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>

                    <div className="p-6 sm:p-8">

                        {/* Ícone animado */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-5 animate-pulse">
                            <IoTrashBin className="h-9 w-9 text-red-600" />
                        </div>

                        {/* Preview da foto */}
                        {previewUrl && (
                            <div className="w-full mb-5">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-xl shadow-md border border-gray-200"
                                />
                            </div>
                        )}

                        {/* Título */}
                        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 text-center mb-3">
                            {title}
                        </h3>

                        {/* Mensagem */}
                        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* Botões */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

                            {/* Cancelar */}
                            <button
                                onClick={onClose}
                                className="w-full sm:w-1/2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                            >
                                {cancelText}
                            </button>

                            {/* Confirmar */}
                            <button
                                onClick={handleConfirm}
                                className="w-full sm:w-1/2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-110 active:scale-95 shadow-md"
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
