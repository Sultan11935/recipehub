// src/pages/RecipeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, updateRecipe } from '../services/api';
import '../App.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await getRecipeById(id);
        setRecipe(response.data);
        setFormData(response.data); // Initialize form data with recipe data
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
        alert('Failed to load recipe details');
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle input changes for the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Update the recipe in the backend and reflect changes in the UI
  const handleUpdate = async () => {
    try {
      await updateRecipe(id, formData); // Call the update API
      alert('Recipe updated successfully');
      setRecipe(formData); // Update recipe state with new data
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Failed to update recipe:', error);
      if (error.response) {
        alert(`Update failed: ${error.response.data.message}`);
      } else {
        alert('Update failed: An unexpected error occurred');
      }
    }
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="recipe-detail-container">
      <h2>Recipe Detail</h2>
      {isEditing ? (
        <div className="recipe-detail-form">
          <label htmlFor="Name">Name</label>
          <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />

          <label htmlFor="CookTime">Cook Time</label>
          <input type="text" name="CookTime" value={formData.CookTime} onChange={handleChange} />

          <label htmlFor="PrepTime">Prep Time</label>
          <input type="text" name="PrepTime" value={formData.PrepTime} onChange={handleChange} />

          <label htmlFor="TotalTime">Total Time</label>
          <input type="text" name="TotalTime" value={formData.TotalTime} onChange={handleChange} />

          <label htmlFor="Description">Description</label>
          <textarea name="Description" value={formData.Description} onChange={handleChange}></textarea>

          <label htmlFor="RecipeCategory">Category</label>
          <input type="text" name="RecipeCategory" value={formData.RecipeCategory} onChange={handleChange} />

          <label htmlFor="Keywords">Keywords</label>
          <input type="text" name="Keywords" value={formData.Keywords} onChange={handleChange} />

          <label htmlFor="RecipeIngredientQuantities">Ingredient Quantities</label>
          <input type="text" name="RecipeIngredientQuantities" value={formData.RecipeIngredientQuantities} onChange={handleChange} required />

          <label htmlFor="RecipeIngredientParts">Ingredient Parts</label>
          <input type="text" name="RecipeIngredientParts" value={formData.RecipeIngredientParts} onChange={handleChange} required />

          <label htmlFor="RecipeInstructions">Instructions</label>
          <textarea name="RecipeInstructions" value={formData.RecipeInstructions} onChange={handleChange} required></textarea>

          {/* New Image URLs input */}
          <label htmlFor="Images">Image URLs (comma-separated)</label>
          <input
            type="text"
            name="Images"
            value={formData.Images ? formData.Images.join(', ') : ''}
            onChange={(e) => setFormData((prevData) => ({
              ...prevData,
              Images: e.target.value.split(',').map((url) => url.trim())
            }))}
            placeholder="Image URLs"
          />

          <div className="button-container">
            <button onClick={handleUpdate}>Save</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <h3>{recipe.Name}</h3>
          <p><strong>Description:</strong> {recipe.Description}</p>
          <p><strong>Cook Time:</strong> {recipe.CookTime}</p>
          <p><strong>Prep Time:</strong> {recipe.PrepTime}</p>
          <p><strong>Total Time:</strong> {recipe.TotalTime}</p>
          <p><strong>Category:</strong> {recipe.RecipeCategory}</p>
          <p><strong>Keywords:</strong> {recipe.Keywords}</p>
          <p><strong>Ingredient Quantities:</strong> {recipe.RecipeIngredientQuantities}</p>
          <p><strong>Ingredient Parts:</strong> {recipe.RecipeIngredientParts}</p>
          <p><strong>Instructions:</strong> {recipe.RecipeInstructions}</p>
          
          {/* Displaying Image URLs */}
          <div>
            <strong>Image URLs:</strong>
            <ul>
              {recipe.Images && recipe.Images.filter(url => url).length > 0 ? (
                recipe.Images.filter(url => url).map((url, index) => (
                  <li key={index}>
                    <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                  </li>
                ))
              ) : (
                <p>No images available</p>
              )}
            </ul>
          </div>

          <div className="button-container">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button className="cancel-button" onClick={() => navigate('/RecipeList')}>Back to My Recipes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
