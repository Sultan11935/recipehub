const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  RecipeId: { type: Number, unique: true },
  Name: { type: String, required: true },
  AuthorId: { type: Number, required: true },
  AuthorName: { type: String },
  CookTime: String,
  PrepTime: String,
  TotalTime: String,
  DatePublished: String,
  Description: String,
  Images: [String],
  RecipeCategory: String,
  Keywords: [String],
  RecipeIngredientQuantities: String, // Change from [String] to String
  RecipeIngredientParts: String, // Change from [String] to String
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
  RecipeInstructions: String, // Change from [String] to String
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
