// src/pages/RecipeList.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserRecipes, updateRecipe, deleteRecipe } from '../services/api';
import '../App.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the recipe being edited
  const [formData, setFormData] = useState({}); // Holds the data for the recipe being edited
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to view your recipes.');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await getUserRecipes();
        setRecipes(response.data || []);
      } catch (err) {
        console.error('Error fetching recipes:', err.response ? err.response.data : err.message);
        setError('Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this recipe?');
    if (!confirmed) return;

    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter((recipe) => recipe._id !== id));
      alert('Recipe deleted successfully');
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setFormData(recipes[index]); // Populate formData with the recipe data for editing
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      await updateRecipe(id, formData);
      const updatedRecipes = recipes.map((recipe) =>
        recipe._id === id ? { ...recipe, ...formData } : recipe
      );
      setRecipes(updatedRecipes);
      setEditIndex(null); // Exit edit mode
      alert('Recipe updated successfully');
    } catch (error) {
      console.error('Failed to update recipe:', error);
      alert('Update failed');
    }
  };

  return (
    <div className="add-recipe-container">
      <h2 className="recipe-list-title">My Recipes</h2>
      <Link to="/add-recipe" className="add-recipe-button">
        Add New Recipe
      </Link>

      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p>{error}</p>
      ) : recipes.length > 0 ? (
<div className="recipe-list">
  {recipes.map((recipe, index) => (
    <div key={recipe._id} className="recipe-card">
      <h3 className="recipe-title">{index + 1}. {recipe.Name} (ID: {recipe.RecipeId || 'Not Available'})</h3>
      {editIndex === index ? (
        <div className="recipe-detail-form">
          <div className="details-grid">
          
          <label>Name</label>
          <input type="text" name="Name" value={formData.Name || ''} onChange={handleChange} />

          <label>Cook Time</label>
          <input type="text" name="CookTime" value={formData.CookTime || ''} onChange={handleChange} />

          <label>Prep Time</label>
          <input type="text" name="PrepTime" value={formData.PrepTime || ''} onChange={handleChange} />

          <label>Total Time</label>
          <input type="text" name="TotalTime" value={formData.TotalTime || ''} onChange={handleChange} />

          <label>Description</label>
          <textarea name="Description" value={formData.Description || ''} onChange={handleChange}></textarea>

          <label>Calories</label>
          <input type="number" name="Calories" value={formData.Calories || ''} onChange={handleChange} />

          <label>Fat Content</label>
          <input type="number" name="FatContent" value={formData.FatContent || ''} onChange={handleChange} />

          <label>Saturated Fat Content</label>
          <input type="number" name="SaturatedFatContent" value={formData.SaturatedFatContent || ''} onChange={handleChange} />

          <label>Cholesterol Content</label>
          <input type="number" name="CholesterolContent" value={formData.CholesterolContent || ''} onChange={handleChange} />

          <label>Sodium Content</label>
          <input type="number" name="SodiumContent" value={formData.SodiumContent || ''} onChange={handleChange} />

          <label>Carbohydrate Content</label>
          <input type="number" name="CarbohydrateContent" value={formData.CarbohydrateContent || ''} onChange={handleChange} />

          <label>Fiber Content</label>
          <input type="number" name="FiberContent" value={formData.FiberContent || ''} onChange={handleChange} />

          <label>Sugar Content</label>
          <input type="number" name="SugarContent" value={formData.SugarContent || ''} onChange={handleChange} />

          <label>Protein Content</label>
          <input type="number" name="ProteinContent" value={formData.ProteinContent || ''} onChange={handleChange} />

          <label>Recipe Servings</label>
          <input type="number" name="RecipeServings" value={formData.RecipeServings || ''} onChange={handleChange} />

          <label>Recipe Yield</label>
          <input type="text" name="RecipeYield" value={formData.RecipeYield || ''} onChange={handleChange} />

          <label>Category</label>
          <input type="text" name="RecipeCategory" value={formData.RecipeCategory || ''} onChange={handleChange} />

          <label>Keywords</label>
          <input type="text" name="Keywords" value={formData.Keywords || ''} onChange={handleChange} />

          <label>Ingredient Quantities</label>
          <input type="text" name="RecipeIngredientQuantities" value={formData.RecipeIngredientQuantities || ''} onChange={handleChange} />

          <label>Ingredient Parts</label>
          <textarea name="RecipeIngredientParts" value={formData.RecipeIngredientParts || ''} onChange={handleChange}></textarea>

          <label>Instructions</label>
          <textarea name="RecipeInstructions" value={formData.RecipeInstructions || ''} onChange={handleChange}></textarea>
          </div>
          <div className="recipe-actions">
            <button onClick={() => handleSave(recipe._id)}>Save</button>
            <button onClick={() => setEditIndex(null)}>Cancel</button>
          </div>
        </div>
        
      ) : (
        <div className="recipe-details">
        <h4 className="section-title">Recipe Details</h4>
        <div className="details-grid">
        <div className="details-column">
          <p><strong>Description:</strong> {recipe.Description || '-'}</p>
          <p><strong>Calories:</strong> {recipe.Calories || '-'}</p>
          <p><strong>Fat Content:</strong> {recipe.FatContent || '-'}</p>
          <p><strong>Saturated Fat Content:</strong> {recipe.SaturatedFatContent || '-'}</p>
          <p><strong>Cholesterol Content:</strong> {recipe.CholesterolContent || '-'}</p>
          <p><strong>Sodium Content:</strong> {recipe.SodiumContent || '-'}</p>
          <p><strong>Carbohydrate Content:</strong> {recipe.CarbohydrateContent || '-'}</p>
          <p><strong>Fiber Content:</strong> {recipe.FiberContent || '-'}</p>
          <p><strong>Sugar Content:</strong> {recipe.SugarContent || '-'}</p>
          <p><strong>Protein Content:</strong> {recipe.ProteinContent || '-'}</p>
        </div>
        <div className="details-column">
          <p><strong>Recipe Servings:</strong> {recipe.RecipeServings || '-'}</p>
          <p><strong>Recipe Yield:</strong> {recipe.RecipeYield || '-'}</p>
          <p><strong>Cook Time:</strong> {recipe.CookTime || '-'}</p>
          <p><strong>Prep Time:</strong> {recipe.PrepTime || '-'}</p>
          <p><strong>Total Time:</strong> {recipe.TotalTime || '-'}</p>
          <p><strong>Category:</strong> {recipe.RecipeCategory || '-'}</p>
          <p><strong>Keywords:</strong> {recipe.Keywords || '-'}</p>
          <p><strong>Ingredient Quantities:</strong> {recipe.RecipeIngredientQuantities || '-'}</p>
          <p><strong>Ingredient Parts:</strong> {recipe.RecipeIngredientParts || '-'}</p>
          <p><strong>Instructions:</strong> {recipe.RecipeInstructions || '-'}</p>
        </div>
        </div>
        <div className="recipe-actions">
          <button className="edit-button" onClick={() => handleEditClick(index)}>Edit</button>
          <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
        </div>
      </div>
    )}
  </div>
  ))}
</div>

      ) : (
        <p>No recipes available.</p>
      )}
    </div>
  );
};

export default RecipeList;
