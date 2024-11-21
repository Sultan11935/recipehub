// controllers/adminController.js
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis');

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find().select('-passwordHash').skip(skip).limit(limit); // Exclude password hash for security
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};

// Update user details (Admin-only)
exports.updateUserByAdmin = async (req, res) => {
  const { userId } = req.params;
  const { AuthorName, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { AuthorName, role },
      { new: true, runValidators: true }
    ).select('-passwordHash'); // Exclude password hash in response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Invalidate cache for updated user
    await redisClient.del(`user:${userId}`);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete a user (Admin-only)
exports.deleteUserByAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Invalidate cache for deleted user
    await redisClient.del(`user:${userId}`);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};







// Get all recipes with pagination
exports.getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      .populate('user', 'AuthorName AuthorId') // Populate Author details
      .skip(skip)
      .limit(limit);

    const totalRecipes = await Recipe.countDocuments();

    res.status(200).json({
      recipes,
      totalPages: Math.ceil(totalRecipes / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving recipes', error: error.message });
  }
};

// Update recipe details (Admin-only)
exports.updateRecipeByAdmin = async (req, res) => {
  const { recipeId } = req.params;
  const updatedData = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Delete a recipe (Admin-only)
exports.deleteRecipeByAdmin = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};
