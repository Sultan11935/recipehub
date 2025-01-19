const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ReviewId: { type: Number, unique: true }, // Unique identifier for the review
  Rating: { type: Number, min: 1, max: 5, required: true }, // Rating value
  Review: { type: String }, // Optional review text
  username: { type: String, required: true }, // Username of the reviewer
  DateSubmitted: { type: Date, default: Date.now }, // Automatically set to the current date
  DateModified: { type: Date }, // Automatically updated on modifications
});

// Middleware for auto-generating a unique ReviewId (optimized)
ratingSchema.pre('save', async function (next) {
  if (!this.ReviewId) {
    const lastRating = await mongoose.model('Rating').findOne().sort({ ReviewId: -1 });
    this.ReviewId = lastRating ? lastRating.ReviewId + 1 : 1;
  }
  next();
});

// Explicit `DateModified` handling for updates
ratingSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.DateModified = new Date();
  }
  next();
});


const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;
