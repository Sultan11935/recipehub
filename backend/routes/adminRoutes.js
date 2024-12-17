const express = require('express');
const {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateRecipeByAdmin,
  deleteRecipeByAdmin,
  getAllRatings, 
  updateRatingByAdmin, 
  deleteRatingByAdmin,
  getReportsData,
  getRecipeCountByCategory,
} = require('../controllers/adminController');
const { getAllRecipes } = require('../controllers/recipeController');
const authenticateToken = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRole');

const router = express.Router();

// User management
router.get('/users', authenticateToken, authorizeRole(['admin']), getAllUsers);
router.put('/users/:userId', authenticateToken, authorizeRole(['admin']), updateUserByAdmin);
router.delete('/users/:userId', authenticateToken, authorizeRole(['admin']), deleteUserByAdmin);

// Recipe management
router.get('/recipes', authenticateToken, authorizeRole(['admin']), getAllRecipes);
router.put('/recipes/:recipeId', authenticateToken, authorizeRole(['admin']), updateRecipeByAdmin);
router.delete('/recipes/:recipeId', authenticateToken, authorizeRole(['admin']), deleteRecipeByAdmin);

//Rating management
router.get('/ratings', authenticateToken, authorizeRole(['admin']), getAllRatings);
router.put('/ratings/:ratingId', authenticateToken, authorizeRole(['admin']), updateRatingByAdmin);
router.delete('/ratings/:ratingId', authenticateToken, authorizeRole(['admin']), deleteRatingByAdmin);

//Report management
router.get('/reports', getReportsData);
// Category report route
router.get('/reports/categories', authenticateToken, authorizeRole(['admin']), getRecipeCountByCategory);



module.exports = router;
