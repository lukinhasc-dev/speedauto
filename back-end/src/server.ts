import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import veiculosRoutes from './routes/veiculosRoutes';
import vendasRoutes from './routes/vendasRoutes';
import clientesRoutes from './routes/clientesRoutes';
import userRoutes from './routes/userRoutes';
import { testConnection } from './db';
import { spawn } from 'child_process';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' })); // <== adiciona aqui
app.use(express.json());

app.use('/veiculos', veiculosRoutes);
app.use('/vendas', vendasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/login', userRoutes);

app.post('/chatbot', (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem) {
    return res.status(400).json({ resposta: 'Mensagem não fornecida.' });
  }

  const pythonProcess = spawn('python', [path.join(__dirname, 'services', 'chatbot.py'), mensagem]);

  let resposta = '';
  pythonProcess.stdout.on('data', (data) => {
    resposta += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Erro no chatbot: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ resposta: 'Erro interno no servidor.' });
    }
    res.json({ resposta: resposta.trim() });
  });
});


(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Não foi possível iniciar o servidor', err);
  }
})();

export default app;
