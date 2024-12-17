const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  getAllRecipes,
  getTopPopularRecipes,
  getFastestRecipes,
} = require('../controllers/recipeController'); // Ensure these are correctly imported
const authenticateToken = require('../middlewares/auth'); // Import auth middleware
const cache = require('../middlewares/cache'); // Import cache middleware

router.post('/', authenticateToken, createRecipe); // Route to create a recipe

router.get('/search', cache, searchRecipes);
router.get('/top-popular', cache, getTopPopularRecipes);
router.get('/fastest', cache, getFastestRecipes);

router.get('/user', authenticateToken, cache, getUserRecipes); // Route to get user's recipes with cache

router.get('/:id', getRecipeById);


router.put('/:id', authenticateToken, updateRecipe); // Route to update a recipe
router.delete('/:id', authenticateToken, deleteRecipe); // Route to delete a recipe

router.get('/public/all', getAllRecipes);


module.exports = router;
