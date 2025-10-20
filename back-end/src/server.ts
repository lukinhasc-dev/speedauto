import express from 'express';
import dotenv from 'dotenv';
import veiculosRoutes from './routes/veiculosRoutes';
import { testConnection } from './db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware JSON
app.use(express.json());

// Rotas
app.use('/veiculos', veiculosRoutes);

// Rota teste
app.get('/', (req, res) => res.send('Servidor TS + Supabase rodando!'));

// Start do servidor após testar conexão
(async () => {
  try {
    await testConnection(); // testa conexão com Supabase
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Não foi possível iniciar o servidor', err);
  }
})();

export default app;
