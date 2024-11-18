import axios from 'axios';

// Define the base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get the token from localStorage or sessionStorage (assuming token is stored after login)
const getToken = () => localStorage.getItem('token');

// Set up axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include Authorization token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

// User API
export const registerUser = (userData) => axiosInstance.post('/users/signup', userData);
export const loginUser = (credentials) => axiosInstance.post('/users/login', credentials);
export const getProfile = () => axiosInstance.get('/users/profile');
export const updateProfile = (profileData) => axiosInstance.put('/users/profile', profileData); // New function for updating profile
export const deleteUser = () => axiosInstance.delete('/users/profile'); // New function for deleting user


// Recipe API
export const getUserRecipes = () => axiosInstance.get('/recipes/user');
export const getRecipeById = (id) => axiosInstance.get(`/recipes/${id}`);
export const createRecipe = (recipeData) => axiosInstance.post('/recipes', recipeData);
export const updateRecipe = (id, recipeData) => axiosInstance.put(`/recipes/${id}`, recipeData);
export const deleteRecipe = (id) => axiosInstance.delete(`/recipes/${id}`);

// Rating API
export const createRating = (ratingData) => axiosInstance.post('/ratings', ratingData);
export const getRatingsForRecipe = (recipeId) => axiosInstance.get(`/ratings/${recipeId}`);
