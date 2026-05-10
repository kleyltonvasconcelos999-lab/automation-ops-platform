import express from 'express';
import { query } from '../../database/index.js';
import { authenticate } from '../../middleware/auth.js';
import { playwrightService } from '../../services/automation/playwright.js';
import { logger } from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Criar sessão
router.post('/', authenticate, async (req, res) => {
  try {
    const { executionId } = req.body;
    const sessionId = await playwrightService.createSession({
      browser: 'chromium',
      headless: false,
    });

    await query(
      `INSERT INTO sessions (id, execution_id, operator_id, status, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [sessionId, executionId, req.user.id, 'active']
    );

    res.status(201).json({
      id: sessionId,
      status: 'active',
    });
  } catch (error) {
    logger.error('Session creation error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Listar sessões
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM sessions WHERE operator_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Session list error:', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

// Fechar sessão
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await playwrightService.closeSession(req.params.id);

    await query(
      'UPDATE sessions SET status = $1, closed_at = NOW() WHERE id = $2',
      ['closed', req.params.id]
    );

    res.json({ message: 'Session closed' });
  } catch (error) {
    logger.error('Session close error:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

export default router;
