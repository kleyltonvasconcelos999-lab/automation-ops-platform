const redis = require('redis');
const logger = require('../utils/logger');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Max Redis retries reached');
        return new Error('Max retries reached');
      }
      return retries * 50;
    }
  }
});

client.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

client.on('connect', () => {
  logger.info('Redis Client Connected');
});

client.on('ready', () => {
  logger.info('Redis Client Ready');
});

client.on('reconnecting', () => {
  logger.warn('Redis Client Reconnecting');
});

const connectRedis = async () => {
  try {
    await client.connect();
    logger.info('Redis connection established');
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
    process.exit(1);
  }
};

connectRedis();

module.exports = client;
