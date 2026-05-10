const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Executed query in ${duration}ms`, { query: text.substring(0, 100) });
    return result;
  } catch (error) {
    logger.error('Database query error', { error: error.message, query: text });
    throw error;
  }
};

const init = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    logger.info('Database connection established');
    return result;
  } catch (error) {
    logger.error('Database initialization failed', error);
    throw error;
  }
};

const end = async () => {
  await pool.end();
  logger.info('Database pool closed');
};

module.exports = {
  query,
  pool,
  init,
  end
};
