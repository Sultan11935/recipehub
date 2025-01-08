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
    // Fetch recipes for the logged-in user using the user ID
    const recipes = await Recipe.find({ user: req.user.userId })
      .populate('user', 'username AuthorName') // Populate only required fields
      //.select('Name Description AggregatedRating ReviewCount'); // Return essential recipe fields

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this user' });
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

    // Check if the request is from an admin (authenticated)
    const isAdmin = req.user && req.user.role === 'admin';

    // Fetch recipes and conditionally populate user details
    const recipes = await Recipe.find()
      .populate('user', isAdmin ? 'AuthorName AuthorId email' : 'AuthorName AuthorId') // Public gets basic info, admin gets full details
      .select(isAdmin ? '' : 'Name Description AggregatedRating ReviewCount RecipeIngredientParts Keywords') // Restrict fields for public
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

    // Invalidate Redis cache
    await redisClient.del(`recipe:${id}`);
    await redisClient.del('top-popular-recipes');
    const keys = await redisClient.keys('search:*');
    if (keys.length > 0) await redisClient.del(keys); // Invalidate all search queries

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

    // Perform a $text search
    let recipes = await Recipe.aggregate([
      { $match: { $text: { $search: query } } },
      { $sort: { score: { $meta: 'textScore' } } }, // Sort by text relevance
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          Name: 1,
          Description: 1,
          AggregatedRating: 1,
          ReviewCount: 1,
          'user.AuthorName': 1,
        },
      },
    ]);

    // If no text search results, fallback to regex
    if (recipes.length === 0) {
      recipes = await Recipe.find({
        Name: { $regex: query, $options: 'i' },
      })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('user', 'AuthorName')
        .select('Name Description AggregatedRating ReviewCount');
    }

    const totalRecipes = recipes.length; // Adjust total based on results

    const response = {
      recipes,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalRecipes / limit),
      totalRecipes,
    };

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(response)); // Cache for 1 hour
    res.status(200).json(response);
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
};






// Get Top 10 Popular Recipes (by ReviewCount and AggregatedRating)
exports.getTopPopularRecipes = async (req, res) => {
  const cacheKey = 'top-popular-recipes';

  try {
    // Check Redis cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving Top Recipes from Redis Cache');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Fetch precomputed recipes from MongoDB
    const recipes = await Recipe.find()
      .sort({ ReviewCount: -1, AggregatedRating: -1 }) // Sort by precomputed fields
      .limit(10)
      .select('Name Description AggregatedRating ReviewCount') // Use precomputed fields
      .populate('user', 'AuthorName');

    // Store result in Redis cache
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

    const recipes = await Recipe.aggregate([
      {
        $addFields: {
          // Parse TotalTime to numeric (convert PT format and plain numeric values)
          TotalTimeNumeric: {
            $cond: {
              if: { $regexMatch: { input: '$TotalTime', regex: /^PT/ } },
              then: {
                $let: {
                  vars: {
                    durationMatch: {
                      $regexFind: { input: '$TotalTime', regex: /PT(?:(\d+)H)?(?:(\d+)M)?/ },
                    },
                  },
                  in: {
                    $add: [
                      {
                        $multiply: [
                          { $toInt: { $ifNull: [{ $arrayElemAt: ['$$durationMatch.captures', 0] }, 0] } },
                          60, // Hours to minutes
                        ],
                      },
                      { $toInt: { $ifNull: [{ $arrayElemAt: ['$$durationMatch.captures', 1] }, 0] } },
                    ],
                  },
                },
              },
              else: {
                $cond: [{ $ne: ['$TotalTime', ''] }, { $toInt: '$TotalTime' }, 0],
              },
            },
          },
        },
      },
      {
        $match: {
          TotalTimeNumeric: { $gt: 0 }, // Filter out null, N/A, or 0 TotalTime
        },
      },
      { $sort: { TotalTimeNumeric: 1 } }, // Sort by TotalTimeNumeric ascending
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          pipeline: [{ $project: { AuthorName: 1 } }],
          as: 'user',
        },
      },
      {
        $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          Name: 1,
          Description: 1,
          CookTime: 1,
          PrepTime: 1,
          TotalTime: 1,
          TotalTimeNumeric: 1,
          AggregatedRating: 1,
          ReviewCount: 1,
          SubmittedBy: { $ifNull: ['$user.AuthorName', 'Anonymous'] },
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
