const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/userController');
const router = express.Router();
const authenticateToken = require('../middlewares/auth'); // Import the middleware


// User registration
router.post('/signup', registerUser);

// User login
router.post('/login', loginUser);

// Profile route
router.get('/profile', authenticateToken, getProfile);

// Route for updating profile
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
