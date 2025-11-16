import axios from 'axios';

const API_URL = 'http://localhost:5000';

export interface ChatbotRequest {
  message: string;
}

export interface ChatbotResponse {
  id: number;
  text: string;
  sender: 'ai';
  timestamp: string;
  suggestions?: Array<{ text: string; action: string; icon: string }>;
}

/**
 * Envia mensagem do usuário ao backend (chatbot)
 */
export const postMessageToBot = async (message: string): Promise<ChatbotResponse> => {
  try {
    const response = await axios.post<ChatbotResponse>(
      `${API_URL}/api/chatbot`,
      { message },
      {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("Erro API chatbot:", err?.response?.data || err);

    // Tratamento para o front
    return {
      id: Date.now(),
      text: "Ocorreu um erro ao conectar com o chatbot. Tente novamente em instantes.",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
  }
};
