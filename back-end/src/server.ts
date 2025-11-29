import dotenv from 'dotenv';
import app from './app';
import { testConnection } from './db';

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await testConnection();
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Não foi possível iniciar o servidor', err);
  }
})();

