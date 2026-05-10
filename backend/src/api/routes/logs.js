import express from 'express';
import { query } from '../../database/index.js';
import { authenticate } from '../../middleware/auth.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Registrar log
router.post('/', authenticate, async (req, res) => {
  try {
    const { executionId, sessionId, level, message, metadata } = req.body;

    await query(
      `INSERT INTO logs (execution_id, session_id, level, message, metadata, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [executionId, sessionId, level, message, JSON.stringify(metadata || {})]
    );

    res.status(201).json({ success: true });
  } catch (error) {
    logger.error('Log creation error:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Obter logs
router.get('/:executionId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM logs WHERE execution_id = $1 ORDER BY created_at ASC`,
      [req.params.executionId]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Log retrieval error:', error);
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

export default router;
