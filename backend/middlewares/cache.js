const redisClient = require('../config/redis');

const cache = (req, res, next) => {
  const id = req.params?.id; // Use optional chaining to safely access id

  if (!id) {
    if (typeof next === 'function') {
      return next(); // Proceed without cache if there's no ID
    }
    return; // Stop if next is not a function
  }

  // Attempt to retrieve data from Redis cache
  redisClient.get(`recipe:${id}`, (err, data) => {
    if (err) throw err;
    if (data) {
      console.log(`Cache hit for recipe ${id}`);
      res.json(JSON.parse(data));
    } else {
      console.log(`Cache miss for recipe ${id}`);
      next(); // Call next() to continue if data is not found in cache
    }
  });
};

module.exports = cache;
