const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe'); // Import the Recipe model


// Helper function to generate a unique AuthorId
const generateUniqueAuthorId = async () => {
  const lastUser = await User.findOne().sort({ AuthorId: -1 });
  return lastUser ? lastUser.AuthorId + 1 : 1000; // Starts AuthorId at 1000 if no users exist
};

exports.registerUser = async (req, res) => {
  try {
    console.log("Received registration data:", req.body); // Log received data
    const { username, email, password, AuthorName = 'Anonymous' } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User with this email already exists:", email); // Log duplicate email
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate a unique AuthorId
    const AuthorId = await generateUniqueAuthorId();

    // Create and save new user
    const newUser = new User({ username, AuthorName, email, passwordHash, AuthorId });
    await newUser.save();
    console.log("User registered successfully:", newUser); // Log new user details
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Detailed error logging
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

    // Sign the token with user information
    const token = jwt.sign(
      { userId: user._id, AuthorId: user.AuthorId, AuthorName: user.AuthorName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Assumes userId is stored in the token
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Assume userId is stored in the token

    // Delete all recipes associated with the user
    await Recipe.deleteMany({ AuthorId: req.user.AuthorId });

    // Delete the user account
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User and associated recipes deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Use the userId from the authenticated user token
    const { AuthorName } = req.body;

    // Update only the AuthorName field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { AuthorName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error.message); // Detailed error logging
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

