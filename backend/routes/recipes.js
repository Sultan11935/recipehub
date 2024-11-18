const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const authenticateToken = require('../middlewares/auth'); // Authentication middleware
const cache = require('../middlewares/cache'); // Caching middleware


//router.get('/', getRecipes); // Public route to get all recipes
router.post('/', authenticateToken, createRecipe); // Protect route to create recipe
router.get('/user', authenticateToken, getUserRecipes); // Protect route to get user's recipes
router.get('/:id', authenticateToken, getRecipeById); // Protect route to get recipe by ID
router.put('/:id', authenticateToken, updateRecipe); // Protect route to update recipe
router.delete('/:id', authenticateToken, deleteRecipe); // Protect route to delete recipe


module.exports = router;