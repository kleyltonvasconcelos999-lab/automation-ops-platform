const { Pool } = require('pg');
const config = require('../config');
const logger = require('../config/logger');

let pool;

const initializeDatabase = async () => {
  try {
    pool = new Pool({
      connectionString: config.DATABASE_URL || `postgresql://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`
    });

    // Test connection
    const result = await pool.query('SELECT NOW()');
    logger.info('Database connected:', result.rows[0]);
    
    // Run migrations
    await runMigrations();
    
    return pool;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

const runMigrations = async () => {
  try {
    const migrations = [
      // Users
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'operator',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Automations
      `CREATE TABLE IF NOT EXISTS automations (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        flow JSONB NOT NULL,
        created_by INTEGER REFERENCES users(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Sessions
      `CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        automation_id INTEGER REFERENCES automations(id),
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        browser_type VARCHAR(50) DEFAULT 'chromium',
        headless BOOLEAN DEFAULT false,
        started_at TIMESTAMP,
        ended_at TIMESTAMP,
        duration_ms INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Executions
      `CREATE TABLE IF NOT EXISTS executions (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        session_id INTEGER REFERENCES sessions(id),
        automation_id INTEGER REFERENCES automations(id),
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        error_message TEXT,
        started_at TIMESTAMP,
        ended_at TIMESTAMP,
        duration_ms INTEGER,
        total_steps INTEGER,
        completed_steps INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Logs
      `CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        execution_id INTEGER REFERENCES executions(id) ON DELETE CASCADE,
        session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
        level VARCHAR(50) DEFAULT 'info',
        message TEXT NOT NULL,
        metadata JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Screenshots
      `CREATE TABLE IF NOT EXISTS screenshots (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        execution_id INTEGER REFERENCES executions(id) ON DELETE CASCADE,
        session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        width INTEGER,
        height INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Notifications
      `CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        message TEXT,
        data JSONB,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Índices
      `CREATE INDEX IF NOT EXISTS idx_sessions_automation ON sessions(automation_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status)`,
      `CREATE INDEX IF NOT EXISTS idx_executions_session ON executions(session_id)`,
      `CREATE INDEX IF NOT EXISTS idx_executions_user ON executions(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status)`,
      `CREATE INDEX IF NOT EXISTS idx_logs_execution ON logs(execution_id)`,
      `CREATE INDEX IF NOT EXISTS idx_logs_session ON logs(session_id)`,
      `CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp)`,
      `CREATE INDEX IF NOT EXISTS idx_screenshots_execution ON screenshots(execution_id)`,
      `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read)`
    ];

    for (const migration of migrations) {
      await pool.query(migration);
    }
    
    logger.info('✅ Database migrations completed');
  } catch (error) {
    logger.error('Migration error:', error);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool;
};

const query = async (text, params) => {
  const p = getPool();
  return p.query(text, params);
};

module.exports = {
  initializeDatabase,
  getPool,
  query
};
