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
  RecipeIngredientQuantities: [String],
  RecipeIngredientParts: [String],
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
  RecipeInstructions: [String],
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
