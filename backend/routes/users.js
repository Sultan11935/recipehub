const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, deleteUser, getTopActiveUsers } = require('../controllers/userController');
const router = express.Router();
const authenticateToken = require('../middlewares/auth'); // Import the authentication middleware
const cache = require('../middlewares/cache'); // Import cache middleware

// User registration
router.post('/signup', registerUser);

// User login
router.post('/login', loginUser);

// Profile route
router.get('/profile', authenticateToken, cache, getProfile); // Use cache on profile route if needed

// Route for updating profile
router.put('/profile', authenticateToken, updateProfile);

// Route for deleting user and associated data
router.delete('/profile', authenticateToken, deleteUser);

router.get('/top-active-users', cache, getTopActiveUsers);


module.exports = router;
