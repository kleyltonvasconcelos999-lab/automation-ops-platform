const { query } = require('./database');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

class LogService {
  async createLog(executionId, sessionId, level, message, metadata = {}) {
    try {
      const result = await query(
        `INSERT INTO logs (execution_id, session_id, level, message, metadata, timestamp)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
        [executionId, sessionId, level, message, JSON.stringify(metadata)]
      );

      logger.info(`📝 Log criado: [${level.toUpperCase()}] ${message}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erro ao criar log:', error);
      throw error;
    }
  }

  async getLogsForExecution(executionId, limit = 100) {
    try {
      const result = await query(
        `SELECT * FROM logs WHERE execution_id = $1 ORDER BY timestamp DESC LIMIT $2`,
        [executionId, limit]
      );

      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar logs:', error);
      throw error;
    }
  }

  async getLogsForSession(sessionId, limit = 100) {
    try {
      const result = await query(
        `SELECT * FROM logs WHERE session_id = $1 ORDER BY timestamp DESC LIMIT $2`,
        [sessionId, limit]
      );

      return result.rows;
    } catch (error) {
      logger.error('Erro ao buscar logs da sessão:', error);
      throw error;
    }
  }

  async clearLogsForExecution(executionId) {
    try {
      await query(
        `DELETE FROM logs WHERE execution_id = $1`,
        [executionId]
      );

      logger.info(`🗑️ Logs da execução ${executionId} deletados`);
    } catch (error) {
      logger.error('Erro ao deletar logs:', error);
      throw error;
    }
  }
}

module.exports = new LogService();
