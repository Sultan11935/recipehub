const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis');
const mongoose = require('mongoose');

// Add Rating

// Add Rating
exports.addRating = async (req, res) => {
  const { recipeId } = req.params;
  const { Rating: userRating, Review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });

    const existingRating = await Rating.findOne({ recipe: recipeId, user: req.user.userId });
    if (existingRating) {
      return res.status(400).json({ message: 'Rating already exists.' });
    }

    const newRating = new Rating({ recipe: recipeId, user: req.user.userId, Rating: userRating, Review });
    await newRating.save();

    // Recalculate ratings and invalidate cache
    await recalculateRecipeRatings(recipeId);
    await redisClient.del('top-popular-recipes');
    await redisClient.del('top-active-users'); 
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.status(201).json({ message: 'Rating added successfully.' });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Error adding rating', error: error.message });
  }
};




// Update Rating
exports.updateRating = async (req, res) => {
  const { recipeId } = req.params;
  const { Rating: userRating, Review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const existingRating = await Rating.findOne({ recipe: recipeId, user: req.user.userId });
    if (!existingRating) {
      return res.status(404).json({ message: 'Rating not found.' });
    }

    existingRating.Rating = userRating;
    existingRating.Review = Review;
    existingRating.DateModified = Date.now();
    await existingRating.save();

    // Recalculate ratings and invalidate cache
    await recalculateRecipeRatings(recipeId);
    await redisClient.del('top-popular-recipes');
    await redisClient.del('top-active-users'); 
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) await redisClient.del(keys);

    res.status(200).json({ message: 'Rating updated successfully.' });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Error updating rating', error: error.message });
  }
};





exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params; // Get the rating ID from the URL params
    const userId = req.user.userId; // Get user ID from the token

    // Find the rating to retrieve the associated recipe ID
    const rating = await Rating.findOne({ _id: id, user: userId });
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found or unauthorized' });
    }

    const recipeId = rating.recipe;

    // Delete the rating
    await Rating.findOneAndDelete({ _id: id, user: userId });

    // Recalculate the aggregated rating and review count for the recipe
    await recalculateRecipeRatings(recipeId);

    // Invalidate the top-popular-recipes cache to ensure fresh results
    await redisClient.del('top-popular-recipes');
    await redisClient.del(`recipe:${recipeId}`); // Invalidate cache for the updated recipe
    await redisClient.del('top-active-users'); 
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) await redisClient.del(keys);
    
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error.message);
    res.status(500).json({ message: 'Failed to delete rating', error: error.message });
  }
};




// View Ratings for a Recipe
exports.getRatingsForRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const ratings = await Rating.find({ recipe: recipeId })
      .populate('user', 'username AuthorName')
      .sort({ DateSubmitted: -1 }) // Uses index on recipe and DateSubmitted
      .skip((page - 1) * limit)
      .limit(limit);

    const totalRatings = await Rating.countDocuments({ recipe: recipeId });

    res.status(200).json({
      reviews: ratings,
      recipeName: recipe.Name,
      totalPages: Math.ceil(totalRatings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({ message: 'Failed to fetch reviews.', error });
  }
};



// Recalculate Recipe Ratings
const recalculateRecipeRatings = async (recipeId) => {
  try {
    // Fetch all ratings for the recipe
    const ratings = await Rating.find({ recipe: recipeId });

    // Calculate total ratings and aggregated rating
    const totalRatings = ratings.length;
    const aggregatedRating =
      totalRatings > 0
        ? ratings.reduce((sum, rating) => sum + rating.Rating, 0) / totalRatings
        : null; // Use null to represent no ratings instead of 0

    // Find the recipe document
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.warn(`Recipe with ID ${recipeId} not found.`);
      return;
    }

    // Update the recipe document
    recipe.AggregatedRating = aggregatedRating !== null ? parseFloat(aggregatedRating.toFixed(2)) : null;
    recipe.ReviewCount = totalRatings;
    await recipe.save();

    // Invalidate cache for the specific recipe and top-popular-recipes
    await redisClient.del(`recipe:${recipeId}`);
    await redisClient.del('top-popular-recipes'); // Invalidate top recipes cache
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) await redisClient.del(keys);
  } catch (error) {
    console.error(`Error recalculating ratings for recipe ${recipeId}:`, error.message);
  }
};













exports.getRatingsForLoggedInUser = async (req, res) => {
  console.log("Entering getRatingsForLoggedInUser...");
  console.log("User ID from token:", req.user.userId);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    // Fetch ratings for the logged-in user with pagination
    const ratings = await Rating.find({ user: req.user.userId, recipe: { $ne: null } })
      .populate('recipe', 'Name _id') // Populate only the Recipe Name and ID
      .sort({ DateSubmitted: -1 }) // Sort by the latest submissions
      .skip(skip)
      .limit(limit);

    // Log fetched ratings for debugging
    console.log(
      "Fetched Ratings:",
      ratings.map((rating) => ({
        ratingId: rating._id,
        recipeId: rating.recipe?._id,
        recipeName: rating.recipe?.Name,
      }))
    );

    // Count total ratings for the user (using index on 'user')
    const totalRatings = await Rating.countDocuments({ user: req.user.userId });

    console.log(`Total Ratings for User ${req.user.userId}:`, totalRatings);

    // Send the response with ratings and pagination info
    res.status(200).json({
      ratings,
      totalPages: Math.ceil(totalRatings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching ratings for logged-in user:", error.message);
    res.status(500).json({ message: "Failed to fetch ratings.", error: error.message });
  }

  console.log("Exiting getRatingsForLoggedInUser...");
};
