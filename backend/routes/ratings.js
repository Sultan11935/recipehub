const express = require('express');
const { 
    addRating, 
    updateRating,
    deleteRating, 
    getRatingsForRecipe, 
    getRatingsForLoggedInUser,
} = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/auth'); // Authentication middleware
const cache = require('../middlewares/cache');
const router = express.Router();

// Add a new rating
router.post('/:recipeId/add', authenticateToken, addRating);

// Update an existing rating
router.put('/:recipeId/update', authenticateToken, updateRating);

// Delete a rating
router.delete('/:id', authenticateToken, deleteRating);

router.get('/user', authenticateToken, cache, getRatingsForLoggedInUser);

// Get ratings for a specific recipe
router.get('/:recipeId', getRatingsForRecipe);






module.exports = router;
