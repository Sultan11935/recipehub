const express = require('express');
const {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllRecipes,
  updateRecipeByAdmin,
  deleteRecipeByAdmin,
} = require('../controllers/adminController');
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

module.exports = router;
