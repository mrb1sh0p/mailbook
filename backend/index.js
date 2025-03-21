import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/email.routes.js';
import orgsRoutes from './routes/orgs.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/v1', emailRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', orgsRoutes);

// Rota de saúde
app.get('/', (req, res) => {
  res.send('Email API v1.0.0');
});

// Configuração da porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
