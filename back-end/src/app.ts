import express from 'express';
import cors from 'cors';
import veiculosRoutes from './routes/veiculosRoutes';
import vendasRoutes from './routes/vendasRoutes';
import clientesRoutes from './routes/clientesRoutes';
import userRoutes from './routes/userRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import dashboardRoutes from './routes/dashboardRoutes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Mount routes
app.use('/veiculos', veiculosRoutes);
app.use('/vendas', vendasRoutes);
app.use('/clientes', clientesRoutes);
app.use('/auth', userRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/dashboard', dashboardRoutes);

export default app;
