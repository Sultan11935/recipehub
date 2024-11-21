const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis');

// Add or Update Rating
exports.addOrUpdateRating = async (req, res) => {
  const { recipeId } = req.params;
  const { Rating: userRating, Review } = req.body;

  try {
    // Check if the user has already rated the recipe
    const existingRating = await Rating.findOne({
      recipe: recipeId,
      user: req.user.userId,
    });

    if (existingRating) {
      // Update the existing rating
      existingRating.Rating = userRating;
      existingRating.Review = Review;
      existingRating.DateModified = Date.now();
      await existingRating.save();
      res.status(200).json({ message: 'Rating updated successfully.' });
    } else {
      // Add a new rating
      const newRating = new Rating({
        recipe: recipeId,
        user: req.user.userId,
        Rating: userRating,
        Review,
      });
      await newRating.save();
      res.status(201).json({ message: 'Rating added successfully.' });
    }

    // Recalculate aggregated rating and review count
    await recalculateRecipeRatings(recipeId);
  } catch (error) {
    console.error('Error adding/updating rating:', error);
    res.status(500).json({ message: 'Error adding/updating rating.', error });
  }
};

// Delete Rating
exports.deleteRating = async (req, res) => {
  const { recipeId } = req.params;

  try {
    // Find and delete the user's rating for the recipe
    const deletedRating = await Rating.findOneAndDelete({
      recipe: recipeId,
      user: req.user.userId,
    });

    if (!deletedRating) {
      return res.status(404).json({ message: 'Rating not found.' });
    }

    // Recalculate aggregated rating and review count
    await recalculateRecipeRatings(recipeId);

    res.status(200).json({ message: 'Rating deleted successfully.' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Error deleting rating.', error });
  }
};

// View Ratings for a Recipe
exports.getRatingsForRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    // Check Redis cache
    const cachedRatings = await redisClient.get(`ratings:${recipeId}`);
    if (cachedRatings) {
      return res.status(200).json(JSON.parse(cachedRatings));
    }

    const ratings = await Rating.find({ recipe: recipeId })
      .populate('user', 'username AuthorName')
      .sort({ DateSubmitted: -1 });

    // Cache the results
    await redisClient.setEx(
      `ratings:${recipeId}`,
      3600, // Cache for 1 hour
      JSON.stringify(ratings)
    );

    res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings.', error });
  }
};

// Recalculate Recipe Ratings
const recalculateRecipeRatings = async (recipeId) => {
  const ratings = await Rating.find({ recipe: recipeId });

  const totalRatings = ratings.length;
  const aggregatedRating =
    totalRatings > 0
      ? ratings.reduce((sum, rating) => sum + rating.Rating, 0) / totalRatings
      : 0;

  // Update the recipe with the new values
  const recipe = await Recipe.findById(recipeId);
  recipe.AggregatedRating = aggregatedRating.toFixed(2);
  recipe.ReviewCount = totalRatings;
  await recipe.save();

  // Invalidate cache for the recipe
  await redisClient.del(`recipe:${recipeId}`);
};
