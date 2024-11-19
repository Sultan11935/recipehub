// routes/adminRoutes.js
const express = require('express');
const { getAllUsers, updateUserByAdmin, deleteUserByAdmin } = require('../controllers/adminController');
const authenticateToken = require('../middlewares/auth'); // Assuming this middleware verifies JWT
const authorizeRole = require('../middlewares/authorizeRole'); // Assuming this middleware checks admin role

const router = express.Router();

// Admin-only route to get all users with pagination
router.get('/users', authenticateToken, authorizeRole(['admin']), getAllUsers);

// Admin-only route to update user details
router.put('/users/:userId', authenticateToken, authorizeRole(['admin']), updateUserByAdmin);

// Admin-only route to delete a user
router.delete('/users/:userId', authenticateToken, authorizeRole(['admin']), deleteUserByAdmin);

module.exports = router;
