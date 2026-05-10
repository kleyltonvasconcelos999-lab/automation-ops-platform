import { logger } from '../../utils/logger.js';

export const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`New WebSocket connection: ${socket.id}`);

    // Registrar operador
    socket.on('register-operator', (operatorData) => {
      socket.join(`operator:${operatorData.id}`);
      io.emit('operator-connected', operatorData);
      logger.info(`Operator registered: ${operatorData.name}`);
    });

    // Registrar sessão
    socket.on('register-session', (sessionId) => {
      socket.join(`session:${sessionId}`);
      logger.info(`Session registered: ${sessionId}`);
    });

    // Desconexão
    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const emitLog = (io, sessionId, logData) => {
  io.to(`session:${sessionId}`).emit('live-log', logData);
};

export const emitScreenshot = (io, sessionId, screenshotData) => {
  io.to(`session:${sessionId}`).emit('screenshot-captured', screenshotData);
};

export const emitExecutionStatus = (io, executionId, status) => {
  io.emit('execution-status-updated', { executionId, status });
};
