// Import necessary modules
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis');
const mongoose = require('mongoose');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
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
      user: req.user.userId, // Reference to the User's ObjectId
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
    await redisClient.del('recipes'); // Clear cache of all recipes

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Get all recipes for the logged-in user
exports.getUserRecipes = async (req, res) => {
  try {
    // Find recipes where the `user` field matches `req.user.userId`
    const recipes = await Recipe.find({ user: req.user.userId }).populate('user', 'username AuthorName');

    if (recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this user' });
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
    // Fetch the recipe by ID and populate the user field
    const recipe = await Recipe.findById(id).populate('user', 'username AuthorName');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Return the recipe if found
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

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, user: req.user.userId }, // Ensure only the owner can update
      req.body,
      { new: true }
    ).populate('user', 'username AuthorName');

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    await redisClient.setEx(`recipe:${id}`, 3600, JSON.stringify(updatedRecipe));
    await redisClient.del('recipes'); // Clear cache of all recipes

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

    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: id,
      user: req.user.userId, // Ensure only the owner can delete
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





