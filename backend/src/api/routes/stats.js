import express from 'express';
import { query } from '../../database/index.js';
import { authenticate } from '../../middleware/auth.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Estatísticas gerais
router.get('/', authenticate, async (req, res) => {
  try {
    const executions = await query(
      'SELECT COUNT(*) as total FROM executions WHERE operator_id = $1',
      [req.user.id]
    );

    const sessions = await query(
      'SELECT COUNT(*) as total FROM sessions WHERE operator_id = $1',
      [req.user.id]
    );

    const activeSessions = await query(
      'SELECT COUNT(*) as total FROM sessions WHERE operator_id = $1 AND status = \'active\'',
      [req.user.id]
    );

    res.json({
      totalExecutions: parseInt(executions.rows[0].total),
      totalSessions: parseInt(sessions.rows[0].total),
      activeSessions: parseInt(activeSessions.rows[0].total),
    });
  } catch (error) {
    logger.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
