import express from 'express';
import { query } from '../../database/index.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { logger } from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Criar tarefa
router.post('/', authenticate, authorize('admin', 'operator'), async (req, res) => {
  try {
    const { name, description, workflow } = req.body;
    const taskId = uuidv4();

    await query(
      `INSERT INTO tasks (id, name, description, workflow, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [taskId, name, description, JSON.stringify(workflow), req.user.id]
    );

    res.status(201).json({
      id: taskId,
      name,
      description,
    });
  } catch (error) {
    logger.error('Task creation error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Listar tarefas
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    logger.error('Task list error:', error);
    res.status(500).json({ error: 'Failed to list tasks' });
  }
});

export default router;
