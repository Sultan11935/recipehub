const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const ratingRoutes = require('./routes/ratings');
require('dotenv').config();

// Check required environment variables
if (!process.env.MONGODB_URI || !process.env.REDIS_URI || !process.env.SESSION_SECRET) {
  console.error("Missing required environment variables. Please check .env file.");
  process.exit(1);
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Redis configuration
const redisClient = new Redis(process.env.REDIS_URI);

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Initialize Express
const app = express();

// Configure CORS with specific origin and credentials
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  credentials: true
}));

app.use(express.json());

// Redis session store configuration
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,  // Change to true if using HTTPS in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Routes
app.get('/api/status', (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ratings', ratingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err.message);
  res.status(500).json({ error: 'An internal server error occurred' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
