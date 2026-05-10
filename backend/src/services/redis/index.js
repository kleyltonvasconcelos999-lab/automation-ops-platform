import redisClient from '../../config/redis.js';
import { logger } from '../../utils/logger.js';

export const initializeRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
    return redisClient;
  } catch (err) {
    logger.error('Redis connection failed:', err);
    throw err;
  }
};

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error('Cache get error:', err);
    return null;
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.error('Cache set error:', err);
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error('Cache delete error:', err);
  }
};

export default redisClient;
