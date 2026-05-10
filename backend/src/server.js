const express = require('express');
const cors = require('express-cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const logger = require('./config/logger');
const database = require('./config/database');
const redis = require('./config/redis');
const websocketHandler = require('./services/websocket/handler');

// Routes
const authRoutes = require('./api/routes/auth');
const executionRoutes = require('./api/routes/executions');
const sessionRoutes = require('./api/routes/sessions');
const logsRoutes = require('./api/routes/logs');
const screenshotRoutes = require('./api/routes/screenshots');
const taskRoutes = require('./api/routes/tasks');
const statsRoutes = require('./api/routes/stats');
const healthRoutes = require('./api/routes/health');

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
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/executions', executionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/screenshots', screenshotRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/health', healthRoutes);

// WebSocket Handler
websocketHandler.init(io);

// Database initialization
database.init().then(() => {
  logger.info('Database connected');
}).catch(err => {
  logger.error('Database connection failed:', err);
  process.exit(1);
});

// Redis initialization
redis.init().then(() => {
  logger.info('Redis connected');
}).catch(err => {
  logger.error('Redis connection failed:', err);
});

// Server startup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 WebSocket ready on ws://localhost:${PORT}`);
  logger.info(`🌍 CORS enabled for ${process.env.WS_CORS_ORIGIN}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
