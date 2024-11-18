// src/pages/AddRecipe.js
import React, { useState } from 'react';
import { createRecipe } from '../services/api';

const AddRecipe = () => {
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    Name: '',
    CookTime: '',
    PrepTime: '',
    TotalTime: '',
    DatePublished: new Date().toISOString().split('T')[0], // Today's date
    Description: '',
    Images: '',
    RecipeCategory: '',
    Keywords: '',
    RecipeIngredientQuantities: '',
    RecipeIngredientParts: '',
    RecipeInstructions: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createRecipe(formData, token);
      alert('Recipe added successfully');
      setFormData({
        Name: '',
        CookTime: '',
        PrepTime: '',
        TotalTime: '',
        DatePublished: new Date().toISOString().split('T')[0],
        Description: '',
        Images: '',
        RecipeCategory: '',
        Keywords: '',
        RecipeIngredientQuantities: '',
        RecipeIngredientParts: '',
        RecipeInstructions: '',
      });
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe');
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Add a New Recipe</h2>
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <div className="full-width">
          <label>Recipe Name</label>
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
        </div>

        <div>
          <label>Cook Time</label>
          <input type="text" name="CookTime" value={formData.CookTime} onChange={handleChange} />
        </div>
        
        <div>
          <label>Prep Time</label>
          <input type="text" name="PrepTime" value={formData.PrepTime} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Total Time</label>
          <input type="text" name="TotalTime" value={formData.TotalTime} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Description</label>
          <textarea name="Description" value={formData.Description} onChange={handleChange}></textarea>
          <div className="char-counter">{formData.Description.length}/200</div>
        </div>

        <div className="full-width">
          <label>Image URLs</label>
          <input type="text" name="Images" value={formData.Images} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Category</label>
          <input type="text" name="RecipeCategory" value={formData.RecipeCategory} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Keywords</label>
          <input type="text" name="Keywords" value={formData.Keywords} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Ingredient Quantities</label>
          <input type="text" name="RecipeIngredientQuantities" value={formData.RecipeIngredientQuantities} onChange={handleChange} required />
        </div>

        <div className="full-width">
          <label>Ingredient Parts</label>
          <input type="text" name="RecipeIngredientParts" value={formData.RecipeIngredientParts} onChange={handleChange} required />
        </div>

        <div className="full-width">
          <label>Instructions</label>
          <textarea name="RecipeInstructions" value={formData.RecipeInstructions} onChange={handleChange} required></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Add Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
