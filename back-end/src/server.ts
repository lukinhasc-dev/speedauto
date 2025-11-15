import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import veiculosRoutes from './routes/veiculosRoutes';
import vendasRoutes from './routes/vendasRoutes';
import clientesRoutes from './routes/clientesRoutes';
import userRoutes from './routes/userRoutes';
import { testConnection } from './db';
import chatbotRoutes from './routes/chatbotRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

dotenv.config({ path: '../.env' });
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' })); // <== adiciona aqui
app.use(express.json());

app.use('/veiculos', veiculosRoutes);
app.use('/vendas', vendasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/login', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/dashboard', dashboardRoutes);

(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Não foi possível iniciar o servidor', err);
  }
})();

export default app;
