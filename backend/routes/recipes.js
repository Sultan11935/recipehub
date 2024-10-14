const express = require('express');
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const authenticateToken = require('../middlewares/auth'); // Authentication middleware
const cache = require('../middlewares/cache'); // Caching middleware
const router = express.Router();

// Create a new recipe (protected route)
router.post('/', authenticateToken, createRecipe);

// Get all recipes (public route)
router.get('/', getRecipes);

// Get a single recipe by ID (public route with caching)
router.get('/:id', cache, getRecipeById);

// Update a recipe (protected route)
router.put('/:id', authenticateToken, updateRecipe);

// Delete a recipe (protected route)
router.delete('/:id', authenticateToken, deleteRecipe);

module.exports = router;
