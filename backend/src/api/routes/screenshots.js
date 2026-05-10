import express from 'express';
import { query } from '../../database/index.js';
import { authenticate } from '../../middleware/auth.js';
import { playwrightService } from '../../services/automation/playwright.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Capturar screenshot
router.post('/', authenticate, async (req, res) => {
  try {
    const { sessionId, executionId } = req.body;
    const screenshotBuffer = await playwrightService.takeScreenshot(sessionId);

    await query(
      `INSERT INTO screenshots (execution_id, session_id, data, captured_at)
       VALUES ($1, $2, $3, NOW())`,
      [executionId, sessionId, screenshotBuffer]
    );

    res.status(201).json({
      message: 'Screenshot captured',
      size: screenshotBuffer.length,
    });
  } catch (error) {
    logger.error('Screenshot capture error:', error);
    res.status(500).json({ error: 'Failed to capture screenshot' });
  }
});

// Obter screenshots
router.get('/:executionId', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, execution_id, session_id, captured_at FROM screenshots 
       WHERE execution_id = $1 ORDER BY captured_at DESC LIMIT 50`,
      [req.params.executionId]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Screenshot list error:', error);
    res.status(500).json({ error: 'Failed to list screenshots' });
  }
});

export default router;
