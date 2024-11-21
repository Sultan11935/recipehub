const express = require('express');
const { addOrUpdateRating, deleteRating, getRatingsForRecipe } = require('../controllers/ratingController');
const authenticateToken = require('../middlewares/auth'); // Authentication middleware
const router = express.Router();

router.post('/:recipeId', authenticateToken, addOrUpdateRating); // Add or update a rating
router.delete('/:recipeId', authenticateToken, deleteRating); // Delete a rating
router.get('/:recipeId', authenticateToken, getRatingsForRecipe); // Get ratings for a recipe


module.exports = router;
