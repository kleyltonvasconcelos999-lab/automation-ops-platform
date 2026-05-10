const redis = require('redis');
const config = require('../config');
const logger = require('../config/logger');

let client;

const initializeRedis = async () => {
  try {
    client = redis.createClient({
      url: config.REDIS_URL
    });

    client.on('error', (err) => logger.error('Redis error:', err));
    client.on('connect', () => logger.info('Redis connected'));

    await client.connect();
    return client;
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

const getClient = () => {
  if (!client) {
    throw new Error('Redis not initialized');
  }
  return client;
};

const set = async (key, value, ttl = null) => {
  const c = getClient();
  if (ttl) {
    await c.setEx(key, ttl, JSON.stringify(value));
  } else {
    await c.set(key, JSON.stringify(value));
  }
};

const get = async (key) => {
  const c = getClient();
  const data = await c.get(key);
  return data ? JSON.parse(data) : null;
};

const del = async (key) => {
  const c = getClient();
  await c.del(key);
};

const keys = async (pattern) => {
  const c = getClient();
  return c.keys(pattern);
};

module.exports = {
  initializeRedis,
  getClient,
  set,
  get,
  del,
  keys
};
