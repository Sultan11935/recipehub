// src/pages/AddRecipe.js
import { useNavigate } from 'react-router-dom'; 
import React, { useState } from 'react';
import { createRecipe } from '../services/api';

const AddRecipe = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    Calories: '',
    FatContent: '',
    SaturatedFatContent: '',
    CholesterolContent: '',
    SodiumContent: '',
    CarbohydrateContent: '',
    FiberContent: '',
    SugarContent: '',
    ProteinContent: '',
    RecipeServings: '',
    RecipeYield: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipeData = {
      ...formData,
      Images: formData.Images.split(',').map((url) => url.trim()),
      Keywords: formData.Keywords.split(',').map((keyword) => keyword.trim()),
      Calories: parseFloat(formData.Calories) || 0,
      FatContent: parseFloat(formData.FatContent) || 0,
      SaturatedFatContent: parseFloat(formData.SaturatedFatContent) || 0,
      CholesterolContent: parseFloat(formData.CholesterolContent) || 0,
      SodiumContent: parseFloat(formData.SodiumContent) || 0,
      CarbohydrateContent: parseFloat(formData.CarbohydrateContent) || 0,
      FiberContent: parseFloat(formData.FiberContent) || 0,
      SugarContent: parseFloat(formData.SugarContent) || 0,
      ProteinContent: parseFloat(formData.ProteinContent) || 0,
      RecipeServings: parseFloat(formData.RecipeServings) || 0,
    };

    try {
      await createRecipe(recipeData, token);
      alert('Recipe added successfully');
      navigate('/RecipeList'); // Redirect to Recipe List page after success
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
        </div>

        <div className="full-width">
          <label>Image URLs (comma-separated)</label>
          <input type="text" name="Images" value={formData.Images} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Category</label>
          <input type="text" name="RecipeCategory" value={formData.RecipeCategory} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Keywords (comma-separated)</label>
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

        <div className="full-width">
          <label>Calories</label>
          <input type="number" name="Calories" value={formData.Calories} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Fat Content</label>
          <input type="number" name="FatContent" value={formData.FatContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Saturated Fat Content</label>
          <input type="number" name="SaturatedFatContent" value={formData.SaturatedFatContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Cholesterol Content</label>
          <input type="number" name="CholesterolContent" value={formData.CholesterolContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Sodium Content</label>
          <input type="number" name="SodiumContent" value={formData.SodiumContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Carbohydrate Content</label>
          <input type="number" name="CarbohydrateContent" value={formData.CarbohydrateContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Fiber Content</label>
          <input type="number" name="FiberContent" value={formData.FiberContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Sugar Content</label>
          <input type="number" name="SugarContent" value={formData.SugarContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Protein Content</label>
          <input type="number" name="ProteinContent" value={formData.ProteinContent} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Recipe Servings</label>
          <input type="number" name="RecipeServings" value={formData.RecipeServings} onChange={handleChange} />
        </div>

        <div className="full-width">
          <label>Recipe Yield</label>
          <input type="text" name="RecipeYield" value={formData.RecipeYield} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Add Recipe</button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
