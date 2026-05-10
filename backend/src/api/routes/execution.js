import express from 'express';
import { query } from '../../database/index.js';
import { authenticate } from '../../middleware/auth.js';
import { logger } from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Iniciar execução
router.post('/', authenticate, async (req, res) => {
  try {
    const { taskId, name, config } = req.body;
    const executionId = uuidv4();

    await query(
      `INSERT INTO executions (id, task_id, name, operator_id, status, config, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [executionId, taskId, name, req.user.id, 'pending', JSON.stringify(config)]
    );

    res.status(201).json({
      id: executionId,
      status: 'pending',
    });
  } catch (error) {
    logger.error('Execution creation error:', error);
    res.status(500).json({ error: 'Failed to create execution' });
  }
});

// Listar execuções
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM executions WHERE operator_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    logger.error('Execution list error:', error);
    res.status(500).json({ error: 'Failed to list executions' });
  }
});

// Obter detalhes da execução
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM executions WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Execution not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Execution detail error:', error);
    res.status(500).json({ error: 'Failed to get execution' });
  }
});

export default router;
