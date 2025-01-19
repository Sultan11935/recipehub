const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis');
const mongoose = require('mongoose');

// Add Rating

exports.addRating = async (req, res) => {
  const { recipeId } = req.params;
  const { Rating: userRating, Review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const newReviewId = recipe.Ratings.reduce((maxId, r) => Math.max(maxId, r.ReviewId || 0), 0) + 1;

    const newRating = {
      ReviewId: newReviewId,
      Rating: userRating,
      Review,
      username: req.user.username,
      DateSubmitted: new Date(),
    };

    recipe.Ratings.push(newRating);

    // Recalculate AggregatedRating and ReviewCount
    recipe.AggregatedRating = parseFloat(
      (recipe.Ratings.reduce((sum, r) => sum + r.Rating, 0) / recipe.Ratings.length).toFixed(2)
    );
    recipe.ReviewCount = recipe.Ratings.length;

    await recipe.save();

    res.status(201).json({ message: 'Rating added successfully.' });
  } catch (error) {
    console.error('Error adding rating:', error.message);
    res.status(500).json({ message: 'Error adding rating.', error: error.message });
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
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const rating = recipe.Ratings.find(r => r.username === req.user.username);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found.' });
    }

    rating.Rating = userRating;
    rating.Review = Review;
    rating.DateModified = new Date();

    // Recalculate AggregatedRating and ReviewCount
    recipe.AggregatedRating = parseFloat(
      (recipe.Ratings.reduce((sum, r) => sum + r.Rating, 0) / recipe.Ratings.length).toFixed(2)
    );
    recipe.ReviewCount = recipe.Ratings.length;

    await recipe.save();

    res.status(200).json({ message: 'Rating updated successfully.' });
  } catch (error) {
    console.error('Error updating rating:', error.message);
    res.status(500).json({ message: 'Error updating rating.', error: error.message });
  }
};








exports.deleteRating = async (req, res) => {
  const { recipeId, reviewId } = req.params;

  console.log(`Received RecipeId: ${recipeId}, ReviewId: ${reviewId}`);

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    console.error('Invalid RecipeId:', recipeId);
    return res.status(400).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.error('Recipe not found for RecipeId:', recipeId);
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    console.log('Original Ratings:', recipe.Ratings);

    // Remove the rating by ReviewId
    const initialLength = recipe.Ratings.length;
    recipe.Ratings = recipe.Ratings.filter(rating => rating.ReviewId !== parseInt(reviewId, 10));

    if (recipe.Ratings.length === initialLength) {
      console.error('Rating not found for ReviewId:', reviewId);
      return res.status(404).json({ message: 'Rating not found.' });
    }

    console.log('Updated Ratings:', recipe.Ratings);

    // Update AggregatedRating and ReviewCount
    if (recipe.Ratings.length > 0) {
      recipe.AggregatedRating = parseFloat(
        (recipe.Ratings.reduce((sum, r) => sum + r.Rating, 0) / recipe.Ratings.length).toFixed(2)
      );
    } else {
      recipe.AggregatedRating = null; // No ratings left
    }
    recipe.ReviewCount = recipe.Ratings.length;

    console.log('New AggregatedRating:', recipe.AggregatedRating, 'New ReviewCount:', recipe.ReviewCount);

    // Save the updated recipe
    await recipe.save();
    console.log('Recipe saved successfully after deletion.');

    res.status(200).json({ message: 'Rating deleted successfully.' });
  } catch (error) {
    console.error('Error deleting rating:', error.message);
    res.status(500).json({ message: 'Error deleting rating.', error: error.message });
  }
};








// View Ratings for a Recipe
exports.getRatingsForRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    return res.status(400).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const recipe = await Recipe.findById(recipeId).select('Name Ratings');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    const totalRatings = recipe.Ratings.length;
    const paginatedRatings = recipe.Ratings
      .sort((a, b) => new Date(b.DateSubmitted) - new Date(a.DateSubmitted)) // Sort by newest first
      .slice((page - 1) * limit, page * limit); // Paginate

    res.status(200).json({
      recipeName: recipe.Name,
      reviews: paginatedRatings,
      totalPages: Math.ceil(totalRatings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching ratings for recipe:', error.message);
    res.status(500).json({ message: 'Failed to fetch ratings.', error: error.message });
  }
};





exports.getRatingsForLoggedInUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    // Fetch recipes with ratings by the logged-in user
    const recipes = await Recipe.find({
      "Ratings.username": req.user.username, // Match ratings with the user's username
    }).select("Name Ratings");

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: "No ratings found for the logged-in user." });
    }

    // Extract and combine all ratings from matching recipes
    const allRatings = recipes
      .flatMap(recipe =>
        recipe.Ratings.filter(rating => rating.username === req.user.username).map(rating => ({
          recipeId: recipe._id,
          recipeName: recipe.Name,
          ...rating._doc, // Include rating fields
        }))
      )
      .sort((a, b) => new Date(b.DateSubmitted) - new Date(a.DateSubmitted)); // Sort by newest first

    // Paginate the ratings
    const totalRatings = allRatings.length;
    const paginatedRatings = allRatings.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      ratings: paginatedRatings,
      totalPages: Math.ceil(totalRatings / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching ratings for logged-in user:", error.message);
    res.status(500).json({ message: "Failed to fetch ratings.", error: error.message });
  }
};

