import React, { useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

interface ChatbotProps {
    isOpen: boolean;
    onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
    const [inputValue, setInputValue] = useState('');

    const quickCommands = [
        'Listar carros disponíveis',
        'Carros acima de 100000',
        'Carros abaixo de 100000',
        'Estatísticas gerais'
    ];

    const sendMessage = async (message: string) => {
        if (!message.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { text: message, isUser: true }]);
        setInputValue('');

        try {
            const response = await fetch('http://localhost:5000/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mensagem: message }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { text: data.resposta, isUser: false }]);
            } else {
                setMessages(prev => [...prev, { text: 'Erro ao conectar com o servidor.', isUser: false }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: 'Erro de conexão.', isUser: false }]);
        }
    };

    const handleQuickCommand = (command: string) => {
        sendMessage(command);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-96 h-[500px] flex flex-col">
                {/* Header */}
                <div className="bg-speedauto-primary text-white p-4 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaRobot />
                        <span className="font-semibold">Chatbot SpeedAuto</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 text-sm">
                            <p>Olá! Escolha uma das opções abaixo:</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                                    message.isUser
                                        ? 'bg-speedauto-primary text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {message.text.split('\n').map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Commands */}
                {messages.length === 0 && (
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-1 gap-2">
                            {quickCommands.map((command, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickCommand(command)}
                                    className="bg-speedauto-primary text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-speedauto-primary/90 transition-colors"
                                >
                                    {command}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-speedauto-primary"
                        />
                        <button
                            onClick={() => sendMessage(inputValue)}
                            className="bg-speedauto-primary text-white p-2 rounded-lg hover:bg-speedauto-primary/90 transition-colors"
                        >
                            <FaPaperPlane size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
