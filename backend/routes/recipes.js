const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
} = require('../controllers/recipeController'); // Ensure these are correctly imported
const authenticateToken = require('../middlewares/auth'); // Import auth middleware
const cache = require('../middlewares/cache'); // Import cache middleware
const authorizeRole = require('../middlewares/authorizeRole'); // Assuming this middleware checks admin role
// Ensure each route has the correct middleware and handler functions

router.post('/', authenticateToken, createRecipe); // Route to create a recipe
router.get('/user', authenticateToken, cache, getUserRecipes); // Route to get user's recipes with cache
router.get('/:id', authenticateToken, cache, getRecipeById);


router.put('/:id', authenticateToken, updateRecipe); // Route to update a recipe
router.delete('/:id', authenticateToken, deleteRecipe); // Route to delete a recipe

module.exports = router;
