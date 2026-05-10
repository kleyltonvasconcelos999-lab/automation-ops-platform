const { Pool } = require('pg');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

let pgPool;
let redisClient;

// Initialize PostgreSQL connection pool
const initializePgPool = async () => {
  pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'automation_ops',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pgPool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pgPool;
};

// Initialize Redis client
const initializeRedis = async () => {
  redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  redisClient.on('connect', () => {
    console.log('Connected to Redis');
  });

  await redisClient.connect();
  return redisClient;
};

// Initialize all databases
const initializeDatabase = async () => {
  try {
    await initializePgPool();
    await initializeRedis();
    console.log('Databases initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Get PostgreSQL pool
const getPgPool = () => {
  if (!pgPool) {
    throw new Error('PostgreSQL pool not initialized');
  }
  return pgPool;
};

// Get Redis client
const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

module.exports = {
  initializeDatabase,
  initializePgPool,
  initializeRedis,
  getPgPool,
  getRedisClient,
};
