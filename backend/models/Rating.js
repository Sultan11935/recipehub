const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ReviewId: { type: Number, unique: true },
  RecipeId: { type: Number, required: true },
  AuthorId: { type: Number, required: true },
  AuthorName: { type: String },
  Rating: { type: Number, min: 1, max: 5, required: true },
  Review: String,
  DateSubmitted: String,
  DateModified: String,
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
