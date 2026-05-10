const pino = require('pino');
const fs = require('fs');
const path = require('path');

const logDir = process.env.LOG_DIR || './logs';

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    levelFirst: true,
    singleLine: false,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname'
  }
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'debug',
    timestamp: pino.stdTimeFunctions.isoTime
  },
  transport
);

// Log to file as well
const fileStream = fs.createWriteStream(
  path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`),
  { flags: 'a' }
);

const fileLogger = pino(
  {
    level: process.env.LOG_LEVEL || 'debug',
    timestamp: pino.stdTimeFunctions.isoTime
  },
  fileStream
);

// Export both loggers
module.exports = {
  info: (msg, data) => {
    logger.info(msg, data);
    fileLogger.info(msg, data);
  },
  error: (msg, data) => {
    logger.error(msg, data);
    fileLogger.error(msg, data);
  },
  warn: (msg, data) => {
    logger.warn(msg, data);
    fileLogger.warn(msg, data);
  },
  debug: (msg, data) => {
    logger.debug(msg, data);
    fileLogger.debug(msg, data);
  },
  trace: (msg, data) => {
    logger.trace(msg, data);
    fileLogger.trace(msg, data);
  }
};
