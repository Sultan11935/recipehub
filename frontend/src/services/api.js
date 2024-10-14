// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User API
export const registerUser = (userData) => axios.post(`${API_URL}/users/signup`, userData);
export const loginUser = (credentials) => axios.post(`${API_URL}/users/login`, credentials);
export const getProfile = (token) =>
  axios.get(`${API_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Recipe API
export const getRecipes = () => axios.get(`${API_URL}/recipes`);
export const getRecipeById = (id) => axios.get(`${API_URL}/recipes/${id}`);
export const createRecipe = (recipeData, token) =>
  axios.post(`${API_URL}/recipes`, recipeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const updateRecipe = (id, recipeData, token) =>
  axios.put(`${API_URL}/recipes/${id}`, recipeData, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const deleteRecipe = (id, token) =>
  axios.delete(`${API_URL}/recipes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

// Rating API
export const createRating = (ratingData, token) =>
  axios.post(`${API_URL}/ratings`, ratingData, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const getRatingsForRecipe = (recipeId) => axios.get(`${API_URL}/ratings/${recipeId}`);
