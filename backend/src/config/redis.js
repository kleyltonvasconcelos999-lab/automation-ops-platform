const redis = require('redis');
const logger = require('./logger');

let client;

const init = async () => {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    client.on('error', (err) => logger.error('Redis client error', err));
    client.on('connect', () => logger.info('Redis client connected'));

    await client.connect();
    logger.info('Redis initialized successfully');
    return client;
  } catch (error) {
    logger.error('Redis initialization failed', error);
    throw error;
  }
};

const get = async (key) => {
  try {
    return await client.get(key);
  } catch (error) {
    logger.error('Redis get error', { key, error: error.message });
    return null;
  }
};

const set = async (key, value, options = {}) => {
  try {
    if (options.ttl) {
      return await client.setEx(key, options.ttl, JSON.stringify(value));
    }
    return await client.set(key, JSON.stringify(value));
  } catch (error) {
    logger.error('Redis set error', { key, error: error.message });
  }
};

const del = async (key) => {
  try {
    return await client.del(key);
  } catch (error) {
    logger.error('Redis del error', { key, error: error.message });
  }
};

const exists = async (key) => {
  try {
    return await client.exists(key);
  } catch (error) {
    logger.error('Redis exists error', { key, error: error.message });
    return 0;
  }
};

const hgetall = async (key) => {
  try {
    return await client.hGetAll(key);
  } catch (error) {
    logger.error('Redis hgetall error', { key, error: error.message });
    return {};
  }
};

const hset = async (key, field, value) => {
  try {
    return await client.hSet(key, field, JSON.stringify(value));
  } catch (error) {
    logger.error('Redis hset error', { key, field, error: error.message });
  }
};

const rpush = async (key, value) => {
  try {
    return await client.rPush(key, JSON.stringify(value));
  } catch (error) {
    logger.error('Redis rpush error', { key, error: error.message });
  }
};

const lrange = async (key, start, stop) => {
  try {
    const data = await client.lRange(key, start, stop);
    return data.map(item => JSON.parse(item));
  } catch (error) {
    logger.error('Redis lrange error', { key, error: error.message });
    return [];
  }
};

const lpop = async (key) => {
  try {
    const data = await client.lPop(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis lpop error', { key, error: error.message });
    return null;
  }
};

const incr = async (key) => {
  try {
    return await client.incr(key);
  } catch (error) {
    logger.error('Redis incr error', { key, error: error.message });
  }
};

const keys = async (pattern) => {
  try {
    return await client.keys(pattern);
  } catch (error) {
    logger.error('Redis keys error', { pattern, error: error.message });
    return [];
  }
};

const flush = async () => {
  try {
    await client.flushDb();
    logger.info('Redis database flushed');
  } catch (error) {
    logger.error('Redis flush error', error);
  }
};

module.exports = {
  init,
  client: () => client,
  get,
  set,
  del,
  exists,
  hgetall,
  hset,
  rpush,
  lrange,
  lpop,
  incr,
  keys,
  flush
};
