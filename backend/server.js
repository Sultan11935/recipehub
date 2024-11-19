const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);
const cors = require('cors');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const ratingRoutes = require('./routes/ratings');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes
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

// Enable JSON body parsing and CORS
app.use(express.json()); // Parse JSON payloads
app.use(cors({
  origin: 'http://localhost:3000', // Update to your frontend's URL
  credentials: true,
}));

// Configure Redis session store
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Status check route
app.get('/api/status', async (req, res) => {
  try {
    res.status(200).json({ message: "API is running!" });
  } catch (error) {
    console.error('Error in /api/status:', error.message);
    res.status(500).json({ message: 'Error fetching status', error: error.message });
  }
});

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes); // Register the admin routes

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:', err.message);
  res.status(500).json({ error: 'An internal server error occurred' });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown handling
const shutdown = () => {
  console.log('Graceful shutdown initiated');
  
  // Close HTTP server
  server.close(() => {
    console.log('HTTP server closed');
    
    // Close MongoDB connection
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      
      // Quit Redis client
      redisClient.quit(() => {
        console.log('Redis connection closed');
        process.exit(0);
      });
    });
  });
};

// Listen for termination signals to trigger graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
