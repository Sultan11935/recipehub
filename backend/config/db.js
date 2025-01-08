// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      readPreference: 'primaryPreferred', // Ensures reads go to primary but fall back to secondaries
      retryWrites: true,                  // Retries write operations if they fail
    });
    console.log('MongoDB connected to replica set');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
