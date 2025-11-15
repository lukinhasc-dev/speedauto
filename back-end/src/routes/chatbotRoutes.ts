import { Router } from 'express';
import { getAIResponse } from '../models/ChatbotModel';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: 'Mensagem inválida.' });
    }

    //chama o Chatbot (com RAG + Gemini 2.0 Flash)
    const aiText = await getAIResponse(message);

    //modelo de resposta padronizado para o frontend
    res.json({
      id: Date.now(),
      text: aiText,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    });

  } catch (err: any) {
    console.error("Erro no chatbot:", err);

    res.status(500).json({
      error: 'Erro ao processar sua mensagem. Tente novamente.'
    });
  }
});

export default router;
