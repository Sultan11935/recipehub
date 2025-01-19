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
export const registerUser = (userData) => axiosInstance.post('/users/signup', userData);
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/users/login', credentials);
    console.log('Login API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getProfile = () => axiosInstance.get('/users/profile');
export const updateProfile = (profileData) => axiosInstance.put('/users/profile', profileData);
export const deleteUser = () => axiosInstance.delete('/users/profile');
export const fetchTopActiveUsers  = () => axiosInstance.get('/users/top-active-users');


// Admin API for managing users
export const fetchAllUsers = (page = 1) => axiosInstance.get(`/admin/users?page=${page}`);
export const updateUserByAdmin = (userId, userData) => axiosInstance.put(`/admin/users/${userId}`, userData);
export const deleteUserByAdmin = (userId) => axiosInstance.delete(`/admin/users/${userId}`);

// Admin API for managing recipes
export const fetchAllRecipes = (page = 1) => axiosInstance.get(`/admin/recipes?page=${page}`);
export const updateRecipeByAdmin = (recipeId, recipeData) => axiosInstance.put(`/admin/recipes/${recipeId}`, recipeData);
export const deleteRecipeByAdmin = (recipeId) => axiosInstance.delete(`/admin/recipes/${recipeId}`);

//Admin API for managing ratings
export const getAllRatings = (page = 1) => axiosInstance.get(`/admin/ratings?page=${page}`);
export const updateRatingByAdmin = (ratingId, ratingData) =>
  axiosInstance.put(`/admin/ratings/${ratingId}`, ratingData);
export const deleteRatingByAdmin = (ratingId) =>
  axiosInstance.delete(`/admin/ratings/${ratingId}`);

//Admin API for managing report
export const getReportsData = () => axiosInstance.get('/admin/reports');
export const getRecipeCategoryReport  = () => axiosInstance.get('/admin/reports/categories');

// Recipe API
export const getUserRecipes = () => axiosInstance.get('/recipes/user');
export const getRecipeById = (id) => axiosInstance.get(`/recipes/${id}`);
export const createRecipe = (recipeData) => axiosInstance.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => axiosInstance.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => axiosInstance.delete(`/recipes/${id}`);
// Public API to fetch all recipes
export const fetchPublicRecipes = (page = 1) =>
  axiosInstance.get(`/recipes/public/all?page=${page}`);
// Search for recipes by name, ingredients, or keywords
export const searchRecipes = (query, page = 1, limit = 10) =>
  axiosInstance.get(`/recipes/search?query=${query}&page=${page}&limit=${limit}`);
export const fetchFastestRecipes = () => axiosInstance.get(`/recipes/fastest`);
// Fetch Top 10 Popular Recipes
export const fetchTopPopularRecipes = () =>
  axiosInstance.get('/recipes/top-popular');



// Rating API

// Fetches ratings for a specific recipe with pagination
export const getRatingsForRecipe = (recipeId, page = 1) =>
  axiosInstance.get(`/ratings/${recipeId}?page=${page}`); // Recipe `_id` is used here

// Add a new rating
export const addRating = (recipeId, ratingData) =>
  axiosInstance.post(`/ratings/${recipeId}/add`, ratingData);

// Update an existing rating
export const updateRating = (recipeId, ratingData) =>
  axiosInstance.put(`/ratings/${recipeId}/update`, ratingData);


export const deleteRating = (recipeId, reviewId) => {
  console.log('DELETE request to:', `/ratings/${recipeId}/${reviewId}`);
  return axiosInstance.delete(`/ratings/${recipeId}/${reviewId}`);
};







// Fetch all ratings for the logged-in user with pagination
export const getRatingsForLoggedInUser = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/ratings/user?page=${page}&limit=${limit}`);
    return response.data; // Return the paginated data
  } catch (error) {
    console.error('Error fetching user ratings:', error.response ? error.response.data : error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user ratings.');
  }
};


