require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIO = require('socket.io');

const config = require('./config');
const logger = require('./config/logger');
const { initializeDatabase } = require('./services/database');
const { initializeRedis } = require('./services/redis');
const { setupWebSocket } = require('./services/websocket');
const { setupRoutes } = require('./api/routes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: config.CORS_ORIGIN || 'http://localhost:3001',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', setupRoutes());

// WebSocket
setupWebSocket(io);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize and start
async function start() {
  try {
    logger.info('🚀 Iniciando servidor...');
    
    // Inicializa banco de dados
    await initializeDatabase();
    logger.info('✅ PostgreSQL conectado');
    
    // Inicializa Redis
    await initializeRedis();
    logger.info('✅ Redis conectado');
    
    // Inicia servidor HTTP
    server.listen(config.PORT, () => {
      logger.info(`✅ Servidor rodando em http://localhost:${config.PORT}`);
      logger.info(`✅ WebSocket em ws://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recebido, encerrando...');
  server.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

start();

module.exports = { app, server, io };
