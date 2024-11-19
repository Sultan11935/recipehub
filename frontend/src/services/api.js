import axios from 'axios';

// Define the base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set up axios instance with base URL and JSON header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include Authorization token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// User API
// Registers a new user
export const registerUser = (userData) => axiosInstance.post('/users/signup', userData);

// Logs in a user and returns both token and role
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/users/login', credentials);
    console.log('Login API response:', response.data); // Debugging log to check the API response
    return response.data; // This should contain both token and role if backend is set correctly
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetches the user's profile
export const getProfile = () => axiosInstance.get('/users/profile');

// Updates the user's AuthorName in their profile
export const updateProfile = (profileData) => axiosInstance.put('/users/profile', profileData);

// Deletes the user and all associated data
export const deleteUser = () => axiosInstance.delete('/users/profile');


// Admin API

// Fetch paginated list of all users (Admin-only)
export const fetchAllUsers = (page = 1) => axiosInstance.get(`/admin/users?page=${page}`);

// Update a user's details (Admin-only)
export const updateUserByAdmin = (userId, userData) => axiosInstance.put(`/admin/users/${userId}`, userData);

// Delete a user (Admin-only)
export const deleteUserByAdmin = (userId) => axiosInstance.delete(`/admin/users/${userId}`);




// Recipe API
// Fetches all recipes created by the user
export const getUserRecipes = () => axiosInstance.get('/recipes/user');

// Fetches a recipe by its ID
export const getRecipeById = (id) => axiosInstance.get(`/recipes/${id}`);

// Creates a new recipe
export const createRecipe = (recipeData) => axiosInstance.post('/recipes', recipeData);

// Updates an existing recipe by its ID
export const updateRecipe = (id, recipeData) => axiosInstance.put(`/recipes/${id}`, recipeData);

// Deletes a recipe by its ID
export const deleteRecipe = (id) => axiosInstance.delete(`/recipes/${id}`);

// Rating API
// Adds a rating to a recipe
export const createRating = (ratingData) => axiosInstance.post('/ratings', ratingData);

// Fetches ratings for a specific recipe
export const getRatingsForRecipe = (recipeId) => axiosInstance.get(`/ratings/${recipeId}`);
