import pool from '../config/database.js';
import { logger } from '../utils/logger.js';

export const setupDatabase = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    logger.info('Database connection successful:', res.rows[0]);
  } catch (err) {
    logger.error('Database connection failed:', err);
    throw err;
  }
};

export const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    logger.error('Query error:', err);
    throw err;
  }
};

export default pool;
