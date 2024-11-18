// Import necessary modules
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const AuthorId = req.user.AuthorId;
    const AuthorName = req.user.AuthorName;

    const {
      Name, CookTime, PrepTime, TotalTime, DatePublished, Description,
      Images, RecipeCategory, Keywords, RecipeIngredientQuantities,
      RecipeIngredientParts, AggregatedRating, ReviewCount, Calories,
      FatContent, SaturatedFatContent, CholesterolContent, SodiumContent,
      CarbohydrateContent, FiberContent, SugarContent, ProteinContent,
      RecipeServings, RecipeYield, RecipeInstructions,
    } = req.body;

    const recipe = new Recipe({
      Name,
      AuthorId,
      AuthorName,
      CookTime,
      PrepTime,
      TotalTime,
      DatePublished,
      Description,
      Images,
      RecipeCategory,
      Keywords,
      RecipeIngredientQuantities,
      RecipeIngredientParts,
      AggregatedRating,
      ReviewCount,
      Calories,
      FatContent,
      SaturatedFatContent,
      CholesterolContent,
      SodiumContent,
      CarbohydrateContent,
      FiberContent,
      SugarContent,
      ProteinContent,
      RecipeServings,
      RecipeYield,
      RecipeInstructions,
    });

    await recipe.save();
    await redisClient.del('recipes'); // Clear the cache of all recipes

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Get all recipes for the logged-in user
exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ AuthorId: req.user.AuthorId });
    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this author' });
    }
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
  }
};

// Get a single recipe by MongoDB _id
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const cachedRecipe = await redisClient.get(`recipe:${id}`);
    if (cachedRecipe) {
      console.log(`Recipe ${id} found in cache`);
      return res.status(200).json(JSON.parse(cachedRecipe));
    }

    const recipe = await Recipe.findById(id); // Use findById for MongoDB's _id

    if (!recipe) {
      console.log(`Recipe ${id} not found in database`);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await redisClient.setEx(`recipe:${id}`, 3600, JSON.stringify(recipe)); // Cache for 1 hour
    console.log(`Recipe ${id} cached`);

    res.status(200).json(recipe);
  } catch (error) {
    console.error(`Error fetching recipe by ID ${id}:`, error.message);
    res.status(500).json({ message: 'Error fetching recipe by ID', error: error.message });
  }
};

// Update a recipe by MongoDB _id
exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.AuthorId;

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, AuthorId: authorId },
      req.body,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    await redisClient.setEx(`recipe:${id}`, 3600, JSON.stringify(updatedRecipe));
    await redisClient.del('recipes');

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error.message);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Delete a recipe by MongoDB _id
exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.AuthorId;

    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: id,
      AuthorId: authorId,
    });

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    await redisClient.del(`recipe:${id}`);
    await redisClient.del('recipes');

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};
