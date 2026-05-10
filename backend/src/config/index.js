require('dotenv').config();

module.exports = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000'),
  BACKEND_PORT: parseInt(process.env.BACKEND_PORT || '3000'),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '5432'),
  DB_USER: process.env.DB_USER || 'admin',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'automation_ops',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Playwright
  PLAYWRIGHT_HEADLESS: process.env.PLAYWRIGHT_HEADLESS !== 'false',
  PLAYWRIGHT_TIMEOUT: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000'),
  PLAYWRIGHT_RETRIES: parseInt(process.env.PLAYWRIGHT_RETRIES || '3'),
  PLAYWRIGHT_VIEWPORT_WIDTH: 1920,
  PLAYWRIGHT_VIEWPORT_HEIGHT: 1080,
  
  // WebSocket
  WS_PORT: parseInt(process.env.WS_PORT || '3000'),
  WS_CORS_ORIGIN: process.env.WS_CORS_ORIGIN || 'http://localhost:3001',
  
  // Logs
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  LOG_DIR: process.env.LOG_DIR || './logs',
  
  // Screenshots
  SCREENSHOTS_DIR: process.env.SCREENSHOTS_DIR || './screenshots',
  SCREENSHOT_COMPRESSION: parseInt(process.env.SCREENSHOT_COMPRESSION || '80'),
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3001',
  
  // Email (Opcional)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  
  // WhatsApp (Opcional)
  WHATSAPP_API_KEY: process.env.WHATSAPP_API_KEY,
  WHATSAPP_API_URL: process.env.WHATSAPP_API_URL,
  
  // Ambiente
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'test'
};
