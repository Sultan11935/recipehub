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
      username: req.user.username, // Use username instead of user reference
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
    console.log('Fetching recipes for:', req.user.username);
    // Fetch recipes for the logged-in user using the username
    const recipes = await Recipe.find({ username: req.user.username }); // Filter by username

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this username' });
    }

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error.message);
    res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
  }
};





// Get all recipes with pagination
exports.getAllRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find()
      //.select('Name Description AggregatedRating ReviewCount RecipeIngredientParts Keywords') // Select required fields
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



// Get a single recipe by MongoDB _id
exports.getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the recipe by ID
    const recipe = await Recipe.findById(id);

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

    // Ensure only the recipe owner can update (filtered by username)
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, username: req.user.username }, // Match recipe by ID and username
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    // Invalidate Redis cache
    await redisClient.del(`recipe:${id}`); // Invalidate specific recipe cache
    await redisClient.del('top-popular-recipes'); // Invalidate top recipes cache
    const keys = await redisClient.keys('search:*'); // Get all search-related keys
    if (keys.length > 0) {
      await redisClient.del(keys); // Invalidate search query cache
    }

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

    // Ensure only the recipe owner can delete (filtered by username)
    const deletedRecipe = await Recipe.findOneAndDelete({
      _id: id,
      username: req.user.username, // Match recipe by ID and username
    });

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found or not authorized' });
    }

    // Invalidate Redis cache
    await redisClient.del(`recipe:${id}`); // Invalidate specific recipe cache
    await redisClient.del('recipes'); // Invalidate general recipes cache
    await redisClient.del('top-popular-recipes'); // Invalidate top recipes cache
    const keys = await redisClient.keys('search:*'); // Get all search-related keys
    if (keys.length > 0) {
      await redisClient.del(keys); // Invalidate search query cache
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error.message);
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};





// Search Recipes by name, ingredients, or keywords
exports.searchRecipes = async (req, res) => {
  let { query, page = 1, limit = 10 } = req.query;

  query = query.trim();

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    const cacheKey = `search:${query}:page:${page}`;
    const cachedResults = await redisClient.get(cacheKey);

    if (cachedResults) {
      console.log('Serving search results from Redis Cache');
      return res.status(200).json(JSON.parse(cachedResults));
    }

    const skip = (page - 1) * limit;

    // Perform an aggregation search on Name, Keywords, and username
    const recipes = await Recipe.aggregate([
      {
        $match: {
          $or: [
            { Name: { $regex: query, $options: 'i' } },
            { Keywords: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } },
          ],
        },
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          Name: 1,
          Description: 1,
          AggregatedRating: 1,
          ReviewCount: 1,
          username: 1,
        },
      },
    ]);

    const totalRecipes = await Recipe.countDocuments({
      $or: [
        { Name: { $regex: query, $options: 'i' } },
        { Keywords: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ],
    });

    const response = {
      recipes,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Cache results for 1 hour
    res.status(200).json(response);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
};





exports.getTopPopularRecipes = async (req, res) => {
  const cacheKey = 'top-popular-recipes';

  try {
    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving Top Recipes from Redis Cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch top 10 recipes sorted by ReviewCount and AggregatedRating
    const recipes = await Recipe.aggregate([
      {
        $sort: { ReviewCount: -1, AggregatedRating: -1 }, // Sort by most reviews and highest rating
      },
      {
        $limit: 10, // Limit to top 10 recipes
      },
      {
        $project: {
          Name: 1,
          Description: 1,
          AggregatedRating: 1,
          ReviewCount: 1,
          username: 1, // Include username directly
        },
      },
    ]);

    // Store result in Redis cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(recipes));

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching top popular recipes:', error.message);
    res.status(500).json({ message: 'Error fetching top popular recipes', error: error.message });
  }
};





// Get Fastest Recipes (by TotalTime)
exports.getFastestRecipes = async (req, res) => {
  const cacheKey = 'fastest-recipes';

  try {
    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving Fastest Recipes from Redis Cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch recipes sorted by TotalTime
    const recipes = await Recipe.aggregate([
      {
        $match: { TotalTime: { $ne: null } }, // Filter out recipes with null TotalTime
      },
      {
        $sort: { TotalTime: 1 }, // Sort by TotalTime ascending
      },
      {
        $limit: 10, // Limit to top 10 fastest recipes
      },
      {
        $project: {
          Name: 1,
          Description: 1,
          CookTime: 1,
          PrepTime: 1,
          TotalTime: 1,
          AggregatedRating: 1,
          ReviewCount: 1,
          username: 1, // Include username directly
        },
      },
    ]);

    // Cache the result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(recipes));

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching fastest recipes:', error.message);
    res.status(500).json({ message: 'Error fetching fastest recipes', error: error.message });
  }
};


