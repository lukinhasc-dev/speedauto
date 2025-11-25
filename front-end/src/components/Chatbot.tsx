import React, { useState, useEffect, useRef, type FormEvent } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSync, FaCar, FaDollarSign, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { postMessageToBot } from '../api/chatbotApi';
// --- Interfaces ---
interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    suggestions?: Array<{ text: string; action: string; icon: React.ReactNode }>;
}

const SuggestionButtons: React.FC<{ suggestions: Array<{ text: string; action: string; icon: React.ReactNode }>, onClick: (action: string) => void }> = ({ suggestions, onClick }) => (
    <div className="flex flex-wrap gap-2 mt-3">
        {suggestions.map((suggestion, index) => (
            <button
                key={index}
                onClick={() => onClick(suggestion.action)}
                className="text-xs font-semibold bg-speedauto-primary/10 text-speedauto-primary border border-speedauto-primary/30 rounded-full px-3 py-1.5 hover:bg-speedauto-primary/20 transition-colors flex items-center gap-1.5"
            >
                {suggestion.icon} {suggestion.text}
            </button>
        ))}
    </div>
);

// --- mensagem de boas-vindas ---
const WELCOME_MESSAGE: ChatMessage = {
    id: 0,
    text: 'Olá! Sou a IA do SpeedAuto. Posso te ajudar a navegar ou buscar dados. O que você gostaria de fazer?',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    suggestions: [
        { text: 'Ver Estoque', action: 'NAV_VEICULOS', icon: <FaCar /> },
        { text: 'Registrar Venda', action: 'NAV_VENDAS', icon: <FaDollarSign /> },
        { text: 'Ver Clientes', action: 'NAV_CLIENTES', icon: <FaUsers /> },
    ],
};


export default function Chatbot() {
    const [isMinimized, setIsMinimized] = useState(true);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [unread, setUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // --- lógica de Envio de Mensagem usando api node ---
    const handleSendMessage = async (text: string) => {
        if (!text || isLoading) return;

        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const userMsg: ChatMessage = { id: Date.now(), text, sender: 'user', timestamp: time };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // CHAMA A API DO BACKEND
            const aiMsg: ChatMessage = await postMessageToBot(text);
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: ChatMessage = { id: Date.now() + 1, text: 'Desculpe, ocorreu um erro de conexão.', sender: 'ai', timestamp: time };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    const handleSuggestionClick = (action: string) => {
        if (action.startsWith('NAV_')) {
            const path = `/${action.split('_')[1].toLowerCase()}`;
            navigate(path);
            setIsMinimized(true);
            return;
        }
        handleSendMessage(action);
    };

    const handleClearChat = () => {
        setMessages([WELCOME_MESSAGE]);
        setIsLoading(false);
        localStorage.removeItem('chatHistory');
    };

    useEffect(() => {
        const storedMessages = localStorage.getItem('chatHistory');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        } else {
            setMessages([WELCOME_MESSAGE]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        if (isMinimized && messages.length > 1 && messages[messages.length - 1].sender === 'ai') {
            setUnread(true);
        }
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isMinimized]);

    const toggleChat = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsMinimized(prev => !prev);
        if (isMinimized) {
            setUnread(false);
        }
    };

    const containerClasses = isMinimized
        ? 'w-16 h-16 rounded-full bg-speedauto-primary/80 backdrop-blur-md shadow-2xl cursor-pointer flex justify-center items-center transition-all duration-300 transform hover:scale-110 border-2 border-white/30 animate-pulse-slow'
        : 'w-80 h-[500px] bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl flex flex-col transition-all duration-300 animate-fade-in-up';

    const headerClasses = 'bg-white/50 p-4 flex justify-between items-center font-bold cursor-pointer border-b border-white/30 flex-shrink-0';

    return (
        <div
            className={`fixed bottom-5 right-5 z-50 ${containerClasses}`}
            onClick={isMinimized ? toggleChat : undefined}
        >
            {isMinimized ? (
                <>
                    <FaRobot size={28} className="text-white" />
                    {unread && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                </>
            ) : (
                <>
                    {/*header*/}
                    <div className={headerClasses}>
                        <span className="flex items-center gap-2 text-lg text-gray-900">
                            <FaRobot className="text-speedauto-primary" /> SpeedAuto AI
                        </span>
                        <div className="flex gap-2">
                            <button onClick={handleClearChat} className="text-gray-500 hover:text-gray-900 border-none bg-transparent text-sm p-1" title="Limpar chat">
                                <FaSync />
                            </button>
                            <button onClick={toggleChat} className="text-gray-500 hover:text-gray-900 border-none bg-transparent text-lg p-1" title="Fechar chat">
                                <FaTimes />
                            </button>
                        </div>
                    </div>

                    {/*painel principal*/}
                    <div className="flex flex-col flex-grow h-full overflow-hidden">
                        {/*mensagens*/}
                        <div id="chatbot-messages" className="flex-1 p-4 overflow-y-auto text-sm space-y-4 h-full">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[85%] animate-fade-in-up ${msg.sender === 'user' ? 'self-end' : 'self-start'
                                        }`}
                                >
                                    <div className={`p-3 rounded-xl shadow-md ${msg.sender === 'user'
                                        ? 'bg-speedauto-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                        }`}>
                                        <p className="font-bold mb-1 text-xs">{msg.sender === 'user' ? 'Você' : 'SpeedAuto'}</p>
                                        <p>{msg.text}</p>
                                        {msg.suggestions && (
                                            <SuggestionButtons suggestions={msg.suggestions} onClick={handleSuggestionClick} />
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'} text-gray-500`}>{msg.timestamp}</p>
                                </div>
                            ))}
                            {/*indicador de loading*/}
                            {isLoading && (
                                <div className="p-3 rounded-xl bg-white text-gray-800 border border-gray-200 rounded-tl-none self-start shadow-md">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse-slow"></div>
                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse-slow delay-150"></div>
                                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse-slow delay-300"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/*input*/}
                        <form onSubmit={handleSubmit} className="p-3 bg-white/80 border-t border-white/30 flex-shrink-0">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Digite sua pergunta..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full border border-gray-300 rounded-full pr-12 pl-4 py-2.5 text-sm focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary disabled:bg-gray-100 disabled:text-gray-500 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 bg-speedauto-primary border-none text-white rounded-full hover:bg-speedauto-primary-hover transition-colors disabled:bg-gray-400"
                                    disabled={isLoading || !input.trim()}
                                >
                                    <FaPaperPlane size={14} className="mx-auto" />
                                </button>
                            </div>
                        </form>
                        <div className="text-center text-xs text-gray-400 py-1.5 bg-white/80">Powered by SpeedAuto AI</div>
                    </div>
                </>
            )}
        </div>
    );
}