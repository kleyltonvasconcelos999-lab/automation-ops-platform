import express from 'express';
import cors from 'express-cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Importar rotas e middleware
import { setupDatabase } from './database/index.js';
import { initializeRedis } from './services/redis/index.js';
import { setupWebSocket } from './services/websocket/index.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Rotas
import authRoutes from './api/routes/auth.js';
import executionRoutes from './api/routes/execution.js';
import sessionRoutes from './api/routes/session.js';
import taskRoutes from './api/routes/task.js';
import logsRoutes from './api/routes/logs.js';
import screenshotsRoutes from './api/routes/screenshots.js';
import statsRoutes from './api/routes/stats.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  },
  pingInterval: parseInt(process.env.WS_PING_INTERVAL || '25000'),
  pingTimeout: 20000,
});

// ============================================
// MIDDLEWARE GLOBAL
// ============================================

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Request Logger
app.use(requestLogger);

// ============================================
// ROTAS
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/screenshots', screenshotsRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error Handler
app.use(errorHandler);

// ============================================
// INICIALIZAÇÃO
// ============================================

async function initializeApp() {
  try {
    logger.info('🚀 Inicializando Automation Ops Platform...');

    // Conectar ao banco de dados
    logger.info('📊 Conectando ao PostgreSQL...');
    await setupDatabase();
    logger.info('✅ PostgreSQL conectado');

    // Conectar ao Redis
    logger.info('🔴 Conectando ao Redis...');
    const redis = await initializeRedis();
    logger.info('✅ Redis conectado');

    // Configurar WebSocket
    logger.info('🔌 Configurando WebSocket...');
    setupWebSocket(io);
    logger.info('✅ WebSocket configurado');

    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || '0.0.0.0';

    httpServer.listen(PORT, HOST, () => {
      logger.info(`✅ Servidor rodando em http://${HOST}:${PORT}`);
      logger.info(`🌍 Ambiente: ${process.env.NODE_ENV}`);
      logger.info(`📱 WebSocket ativo em ws://${HOST}:${PORT}`);
      logger.info(`🎉 Central de Automação Operacional Online!\n`);
    });
  } catch (error) {
    logger.error('❌ Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
}

// Tratar sinais de encerramento
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido. Encerrando...');
  httpServer.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido. Encerrando...');
  httpServer.close(() => {
    logger.info('Servidor encerrado');
    process.exit(0);
  });
});

// Inicializar aplicação
initializeApp();

export { app, httpServer, io };
