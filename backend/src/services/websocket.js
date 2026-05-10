const logger = require('../config/logger');
const { query } = require('./database');
const redis = require('./redis');

const setupWebSocket = (io) => {
  const activeUsers = new Map();
  const activeSessions = new Map();

  io.on('connection', (socket) => {
    logger.info(`📡 Cliente conectado: ${socket.id}`);
    activeUsers.set(socket.id, { socketId: socket.id, connectedAt: new Date() });

    // Broadcast users count
    io.emit('users:update', { count: activeUsers.size });

    // Join execution room
    socket.on('execution:join', (executionId) => {
      socket.join(`execution:${executionId}`);
      logger.info(`✅ Socket ${socket.id} entrou na execução ${executionId}`);
    });

    // Leave execution room
    socket.on('execution:leave', (executionId) => {
      socket.leave(`execution:${executionId}`);
      logger.info(`❌ Socket ${socket.id} saiu da execução ${executionId}`);
    });

    // Start execution
    socket.on('execution:start', async (data) => {
      try {
        logger.info(`🚀 Iniciando execução:`, data);
        io.to(`execution:${data.executionId}`).emit('execution:status', {
          executionId: data.executionId,
          status: 'running',
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Erro ao iniciar execução:', error);
        socket.emit('error', { message: error.message });
      }
    });

    // Stop execution
    socket.on('execution:stop', async (data) => {
      try {
        logger.info(`⏹️ Parando execução:`, data.executionId);
        io.to(`execution:${data.executionId}`).emit('execution:status', {
          executionId: data.executionId,
          status: 'stopped',
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Erro ao parar execução:', error);
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      activeUsers.delete(socket.id);
      logger.info(`📴 Cliente desconectado: ${socket.id}`);
      io.emit('users:update', { count: activeUsers.size });
    });
  });

  return io;
};

const broadcastLog = (io, executionId, log) => {
  io.to(`execution:${executionId}`).emit('log:new', {
    executionId,
    ...log,
    timestamp: new Date()
  });
};

const broadcastScreenshot = (io, executionId, screenshot) => {
  io.to(`execution:${executionId}`).emit('screenshot:new', {
    executionId,
    ...screenshot,
    timestamp: new Date()
  });
};

const broadcastStatus = (io, executionId, status) => {
  io.to(`execution:${executionId}`).emit('status:update', {
    executionId,
    ...status,
    timestamp: new Date()
  });
};

const broadcastProgress = (io, executionId, progress) => {
  io.to(`execution:${executionId}`).emit('progress:update', {
    executionId,
    ...progress,
    timestamp: new Date()
  });
};

module.exports = {
  setupWebSocket,
  broadcastLog,
  broadcastScreenshot,
  broadcastStatus,
  broadcastProgress
};
