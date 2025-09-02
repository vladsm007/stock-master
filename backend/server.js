require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar configuração do banco
const database = require('./src/config/database');

// Importar rotas
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const stockRoutes = require('./src/routes/stockRoutes');
const errorHandler = require('./src/middlewere/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar ao banco de dados
database.connect().catch(console.error);

// Middleware de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Muitas tentativas, tente novamente em 15 minutos' }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/stock', stockRoutes);

// Health check com verificação do banco
app.get('/health', async (req, res) => {
  const dbHealth = await database.healthCheck();
  res.status(dbHealth.status === 'healthy' ? 200 : 503).json({
    status: dbHealth.status === 'healthy' ? 'OK' : 'Error',
    database: dbHealth,
    timestamp: new Date().toISOString()
  });
});
// Middleware de tratamento de erros
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Recebido SIGTERM, iniciando shutdown graceful...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Recebido SIGINT, iniciando shutdown graceful...');
  await database.disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🏥 Health check disponível em http://localhost:${PORT}/health`);
});