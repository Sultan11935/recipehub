const express = require('express');
const { addRating, getRatings } = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/auth'); // Authentication middleware
const router = express.Router();

// Add a new rating (protected route)
router.post('/', authenticateToken, addRating);

// Get all ratings (public route)
router.get('/', getRatings);

module.exports = router;
