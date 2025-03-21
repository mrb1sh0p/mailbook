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

const apiVersion = '/api/v1';
app.use(apiVersion, userRoutes);
app.use(apiVersion, emailRoutes);
app.use(apiVersion, orgsRoutes);

app.get('/', (req, res) => {
  res.send('Email API v1.0.0 - Serviço ativo!');
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
