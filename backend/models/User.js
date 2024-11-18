const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  AuthorId: {
    type: Number,
    unique: true,
  },
  AuthorName: { type: String, required: false, default: 'Anonymous' },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

// Pre-save hook to auto-increment AuthorId
userSchema.pre('save', async function (next) {
  if (!this.AuthorId) {
    // Find the highest current AuthorId
    const lastUser = await mongoose.model('User').findOne({}, {}, { sort: { AuthorId: -1 } });
    this.AuthorId = lastUser ? lastUser.AuthorId + 1 : 1; // Start from 1 if none exists
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
