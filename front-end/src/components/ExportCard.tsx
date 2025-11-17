import React from "react";
import { FaDownload } from "react-icons/fa";

interface ExportCardProps {
    title: string;
    description: string;
    onExport: () => void;
    icon: React.ReactNode;
    color?: "red" | "blue" | "green" | "purple";
}

export default function ExportCard({
    title,
    description,
    onExport,
    icon,
    color = "blue",
}: ExportCardProps) {
    const colorClass =
        color === "red" ? "text-red-500" :
        color === "green" ? "text-green-500" :
        color === "purple" ? "text-purple-500" : "text-blue-500";

    return (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200 hover:shadow-lg transition-all flex flex-col gap-4">

            {/* Título + Ícone à direita */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{description}</p>
                </div>

                <div className={`text-2xl opacity-90 ${colorClass}`}>
                    {icon}
                </div>
            </div>

            {/* Botão */}
            <button
                onClick={onExport}
                className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 shadow transition-all"
            >
                <FaDownload className="text-sm" /> Exportar CSV
            </button>
        </div>
    );
}
