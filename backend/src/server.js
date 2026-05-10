const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

const logger = require('./utils/logger');
const database = require('./config/database');
const redisClient = require('./config/redis');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:3001',
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3001' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Store io instance in app
app.set('io', io);
app.set('redisClient', redisClient);
app.set('db', database);

// Routes
const authRoutes = require('./api/routes/auth');
const executionRoutes = require('./api/routes/executions');
const sessionRoutes = require('./api/routes/sessions');
const taskRoutes = require('./api/routes/tasks');
const logRoutes = require('./api/routes/logs');
const screenshotRoutes = require('./api/routes/screenshots');
const systemRoutes = require('./api/routes/system');

app.use('/api/auth', authRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/screenshots', screenshotRoutes);
app.use('/api/system', systemRoutes);

// Static files
app.use('/screenshots', express.static(path.join(__dirname, '..', 'screenshots')));
app.use('/logs', express.static(path.join(__dirname, '..', 'logs')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// WebSocket
require('./services/websocket')(io, database, redisClient);

// Initialize services
const { AutomationService } = require('./services/automation/AutomationService');
const { TaskQueueService } = require('./services/queue/TaskQueueService');

const automationService = new AutomationService(io, redisClient, database);
const taskQueueService = new TaskQueueService(io, redisClient, database, automationService);

app.set('automationService', automationService);
app.set('taskQueueService', taskQueueService);

// Start task queue processor
taskQueueService.start();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  logger.info(`🚀 Automation Ops Backend running on http://${HOST}:${PORT}`);
  logger.info(`📊 Dashboard available at http://localhost:3001`);
  logger.info(`🔌 WebSocket ready on ws://${HOST}:${PORT}`);
  logger.info(`🗄️  Database: ${process.env.DB_NAME || 'automation_ops'}`);
  logger.info(`💾 Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);
});

module.exports = { app, server, io };
