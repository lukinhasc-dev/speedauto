import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import veiculosRoutes from './routes/veiculosRoutes';
import { testConnection } from './db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' })); // <== adiciona aqui
app.use(express.json());

app.use('/veiculos', veiculosRoutes);

(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Não foi possível iniciar o servidor', err);
  }
})();

export default app;
