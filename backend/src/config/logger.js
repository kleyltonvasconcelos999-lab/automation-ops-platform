const winston = require('winston');
const fs = require('fs');
const path = require('path');
const config = require('./index');

const logsDir = config.LOG_DIR;
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'automation-ops' },
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} [${info.level}]: ${info.message}`
        )
      )
    }),
    // File - Error
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5
    }),
    // File - Combined
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760,
      maxFiles: 5
    })
  ]
});

module.exports = logger;
