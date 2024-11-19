const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ReviewId: { type: Number, unique: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }, // Reference to Recipe model
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
  Rating: { type: Number, min: 1, max: 5, required: true },
  Review: String,
  DateSubmitted: { type: Date, default: Date.now }, // Set to current date by default
  DateModified: Date,
});

// Middleware for auto-generating a unique ReviewId
ratingSchema.pre('save', async function (next) {
  if (!this.ReviewId) {
    const lastRating = await mongoose.model('Rating').findOne().sort({ ReviewId: -1 });
    this.ReviewId = lastRating ? lastRating.ReviewId + 1 : 1;
  }
  next();
});

// Middleware to update DateModified when the review is modified
ratingSchema.pre('findOneAndUpdate', function (next) {
  this.set({ DateModified: Date.now() });
  next();
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
