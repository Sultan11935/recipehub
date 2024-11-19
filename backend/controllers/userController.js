const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis'); // Import Redis client

// Helper function to generate a unique AuthorId
const generateUniqueAuthorId = async () => {
  const lastUser = await User.findOne().sort({ AuthorId: -1 });
  return lastUser ? lastUser.AuthorId + 1 : 1000;
};

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, AuthorName = 'Anonymous', role = 'registered' } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const AuthorId = await generateUniqueAuthorId();
    const newUser = new User({ username, AuthorName, email, passwordHash, AuthorId, role });
    await newUser.save();
    
    // Invalidate user cache to ensure new data is retrieved fresh
    await redisClient.del(`user:${newUser._id}`);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

    // Create the JWT token including the role
    const token = jwt.sign(
      { 
        userId: user._id, 
        AuthorId: user.AuthorId, 
        AuthorName: user.AuthorName, 
        role: user.role // Include role in the token payload
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send both the token and role in the response
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};




exports.getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Check Redis cache first
    const cachedProfile = await redisClient.get(`user:${userId}`);
    if (cachedProfile) {
      return res.status(200).json(JSON.parse(cachedProfile));
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cache the user profile for faster future access
    await redisClient.setEx(`user:${userId}`, 3600, JSON.stringify(user));

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Delete all recipes associated with the user
    await Recipe.deleteMany({ AuthorId: req.user.AuthorId });
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Invalidate cache for user and recipes
    await redisClient.del(`user:${userId}`);
    await redisClient.del(`recipes:${req.user.AuthorId}`);

    res.status(200).json({ message: 'User and associated recipes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { AuthorName } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { AuthorName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update AuthorName in all related recipes
    await Recipe.updateMany({ AuthorId: updatedUser.AuthorId }, { AuthorName: updatedUser.AuthorName });

    // Invalidate cache for user and recipes
    await redisClient.del(`user:${userId}`);
    await redisClient.del(`recipes:${updatedUser.AuthorId}`);

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Fetch recipes by AuthorId with caching
exports.getUserRecipes = async (req, res) => {
  const authorId = req.user.AuthorId;

  try {
    // Check Redis cache for recipes
    const cachedRecipes = await redisClient.get(`recipes:${authorId}`);
    if (cachedRecipes) {
      return res.status(200).json(JSON.parse(cachedRecipes));
    }

    const recipes = await Recipe.find({ AuthorId: authorId });
    if (!recipes.length) {
      return res.status(404).json({ message: 'No recipes found for this author' });
    }

    // Cache the recipes for faster future access
    await redisClient.setEx(`recipes:${authorId}`, 3600, JSON.stringify(recipes));

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
  }
};

