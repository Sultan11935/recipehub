const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ReviewId: { type: Number, unique: true }, // Removed `unique: true` for embedded usage
  Rating: { type: Number, min: 1, max: 5, required: true },
  Review: { type: String },
  username: { type: String, required: true }, // Embedded username of the reviewer
  DateSubmitted: { type: Date, default: Date.now },
  DateModified: { type: Date },
});

// Middleware for updating `DateModified` on modifications
ratingSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.DateModified = new Date();
  }
  next();
});

const recipeSchema = new mongoose.Schema({
  RecipeId: { type: Number, unique: true },
  Name: { type: String, required: true },
  username: { type: String, required: true },
  CookTime: { type: String },
  PrepTime: { type: String },
  TotalTime: { type: String },
  DatePublished: { type: String },
  Description: { type: String },
  Images: [{ type: String }],
  RecipeCategory: { type: String },
  Keywords: [{ type: String }],
  RecipeIngredientQuantities: { type: String },
  RecipeIngredientParts: { type: String },
  AggregatedRating: { type: Number },
  ReviewCount: { type: Number },
  Calories: { type: Number },
  FatContent: { type: Number },
  SaturatedFatContent: { type: Number },
  CholesterolContent: { type: Number },
  SodiumContent: { type: Number },
  CarbohydrateContent: { type: Number },
  FiberContent: { type: Number },
  SugarContent: { type: Number },
  ProteinContent: { type: Number },
  RecipeServings: { type: Number },
  RecipeYield: { type: String },
  RecipeInstructions: { type: String },
  Ratings: [ratingSchema], // Embedded ratings schema
});

// Middleware for auto-generating a unique `RecipeId`
recipeSchema.pre('save', async function (next) {
  if (!this.RecipeId) {
    const lastRecipe = await mongoose.model('Recipe').findOne().sort({ RecipeId: -1 });
    this.RecipeId = lastRecipe ? lastRecipe.RecipeId + 1 : 1;
  }
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
