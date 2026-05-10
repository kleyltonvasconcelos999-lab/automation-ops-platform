const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  application_name: 'automation-ops'
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  logger.debug('New database connection established');
});

const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 100) {
      logger.debug(`Slow query (${duration}ms): ${text}`);
    }
    return res;
  } catch (err) {
    logger.error('Database error:', { error: err.message, query: text });
    throw err;
  }
};

const getConnection = async () => {
  return pool.connect();
};

module.exports = {
  query,
  getConnection,
  pool
};
