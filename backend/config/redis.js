// config/redis.js
const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379',
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
