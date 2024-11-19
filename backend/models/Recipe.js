const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  RecipeId: { type: Number, unique: true },
  Name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  CookTime: String,
  PrepTime: String,
  TotalTime: String,
  DatePublished: String,
  Description: String,
  Images: [String],
  RecipeCategory: String,
  Keywords: [String],
  RecipeIngredientQuantities: String,
  RecipeIngredientParts: String,
  AggregatedRating: Number,
  ReviewCount: Number,
  Calories: Number,
  FatContent: Number,
  SaturatedFatContent: Number,
  CholesterolContent: Number,
  SodiumContent: Number,
  CarbohydrateContent: Number,
  FiberContent: Number,
  SugarContent: Number,
  ProteinContent: Number,
  RecipeServings: Number,
  RecipeYield: String,
  RecipeInstructions: String,
});

// Middleware for auto-generating a unique RecipeId
recipeSchema.pre('save', async function (next) {
  if (!this.RecipeId) {
    const lastRecipe = await mongoose.model('Recipe').findOne().sort({ RecipeId: -1 });
    this.RecipeId = lastRecipe ? lastRecipe.RecipeId + 1 : 1;
  }
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
