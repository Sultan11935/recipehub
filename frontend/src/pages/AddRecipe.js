// src/pages/AddRecipe.js
import React, { useState } from 'react';
import { createRecipe } from '../services/api';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
      Name: name,
      Description: description,
      RecipeIngredientParts: ingredients.split(','),
      RecipeInstructions: instructions.split(',')
    };
    
    try {
      await createRecipe(recipeData, token);
      alert('Recipe added successfully!');
    } catch (error) {
      alert('Failed to add recipe.');
    }
  };

  return (
    <div>
      <h2>Add a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Recipe Name" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ingredients (comma-separated)" required />
        <input type="text" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Instructions (comma-separated)" required />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
