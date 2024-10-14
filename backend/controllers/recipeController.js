// controllers/recipeController.js
const Recipe = require('../models/Recipe');
const redisClient = require('../config/redis'); // Update the path as per your configuration

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Function to get all recipes with Redis caching
exports.getRecipes = async (req, res) => {
    try {
      const recipes = await redisClient.get('recipes');
      
      if (recipes) {
        return res.status(200).json(JSON.parse(recipes));
      }
      
      const allRecipes = await Recipe.find();
      await redisClient.setEx('recipes', 3600, JSON.stringify(allRecipes)); // Cache for 1 hour
      res.status(200).json(allRecipes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Function to get a single recipe by ID with Redis caching
  exports.getRecipeById = async (req, res) => {
    const { id } = req.params;
    try {
      const cachedRecipe = await redisClient.get(`recipe:${id}`);
      
      if (cachedRecipe) {
        return res.status(200).json(JSON.parse(cachedRecipe));
      }
      
      const recipe = await Recipe.findById(id);
      
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      
      await redisClient.setEx(`recipe:${id}`, 3600, JSON.stringify(recipe)); // Cache for 1 hour
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};
