// controllers/adminController.js
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Rating = require('../models/Rating');
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




// Get all ratings with pagination
exports.getAllRatings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const ratings = await Rating.find()
      .populate('recipe', 'Name') // Populate Recipe Name
      .populate('user', 'AuthorName') // Populate User Name
      .skip(skip)
      .limit(limit);

    const totalRatings = await Rating.countDocuments();

    res.status(200).json({
      ratings,
      totalPages: Math.ceil(totalRatings / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ratings', error: error.message });
  }
};

// Update a rating (Admin-only)
exports.updateRatingByAdmin = async (req, res) => {
  const { ratingId } = req.params;
  const updatedData = req.body;

  try {
    const updatedRating = await Rating.findByIdAndUpdate(
      ratingId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating updated successfully', rating: updatedRating });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rating', error: error.message });
  }
};

// Delete a rating (Admin-only)
exports.deleteRatingByAdmin = async (req, res) => {
  const { ratingId } = req.params;

  try {
    const deletedRating = await Rating.findByIdAndDelete(ratingId);

    if (!deletedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting rating', error: error.message });
  }
};



exports.getReportsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.status(200).json({ totalUsers, totalRecipes, totalRatings });
  } catch (error) {
    console.error('Error fetching reports data:', error);
    res.status(500).json({ message: 'Error fetching reports data', error: error.message });
  }
};


// Get recipe count by category
exports.getRecipeCountByCategory = async (req, res) => {
  try {
    const categoryReport = await Recipe.aggregate([
      {
        $group: {
          _id: "$RecipeCategory", // Group by category field
          count: { $sum: 1 },     // Count recipes in each category
        },
      },
      { $sort: { count: -1 } },  // Sort descending by count
    ]);

    res.status(200).json(categoryReport);
  } catch (error) {
    console.error('Error fetching category report:', error.message);
    res.status(500).json({ message: 'Error fetching category report', error: error.message });
  }
};
