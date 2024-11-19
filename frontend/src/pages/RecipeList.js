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
        console.log('Fetched recipes:', response.data);
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
    <div className="recipe-container-container">
      <h2>My Recipes</h2>
      <Link to="/add-recipe" className="add-recipe-button">Add New Recipe</Link>

      {loading ? (
        <p>Loading recipes...</p>
      ) : error ? (
        <p>{error}</p>
      ) : recipes.length > 0 ? (
        <div>
          {recipes.map((recipe, index) => (
            <div key={recipe._id} className="recipe-item">
              <h3>{index + 1}. {recipe.Name}</h3>
              {editIndex === index ? (
                <div className="recipe-detail-form">
                  <label htmlFor="Name">Name</label>
                  <input
                    type="text"
                    name="Name"
                    value={formData.Name || ''}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="CookTime">Cook Time</label>
                  <input
                    type="text"
                    name="CookTime"
                    value={formData.CookTime || ''}
                    onChange={handleChange}
                  />

                  <label htmlFor="PrepTime">Prep Time</label>
                  <input
                    type="text"
                    name="PrepTime"
                    value={formData.PrepTime || ''}
                    onChange={handleChange}
                  />

                  <label htmlFor="TotalTime">Total Time</label>
                  <input
                    type="text"
                    name="TotalTime"
                    value={formData.TotalTime || ''}
                    onChange={handleChange}
                  />

                  <label htmlFor="Description">Description</label>
                  <textarea
                    name="Description"
                    value={formData.Description || ''}
                    onChange={handleChange}
                  ></textarea>

                  <label htmlFor="RecipeCategory">Category</label>
                  <input
                    type="text"
                    name="RecipeCategory"
                    value={formData.RecipeCategory || ''}
                    onChange={handleChange}
                  />

                  <label htmlFor="Keywords">Keywords</label>
                  <input
                    type="text"
                    name="Keywords"
                    value={(formData.Keywords || []).join(', ')}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        Keywords: e.target.value.split(',').map((k) => k.trim()),
                      }))
                    }
                  />

                  <label htmlFor="RecipeIngredientQuantities">Ingredient Quantities</label>
                  <input
                    type="text"
                    name="RecipeIngredientQuantities"
                    value={formData.RecipeIngredientQuantities || ''}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="RecipeIngredientParts">Ingredient Parts</label>
                  <input
                    type="text"
                    name="RecipeIngredientParts"
                    value={formData.RecipeIngredientParts || ''}
                    onChange={handleChange}
                    required
                  />

                  <label htmlFor="RecipeInstructions">Instructions</label>
                  <textarea
                    name="RecipeInstructions"
                    value={formData.RecipeInstructions || ''}
                    onChange={handleChange}
                    required
                  ></textarea>

                  <label htmlFor="Images">Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    name="Images"
                    value={(formData.Images || []).join(', ')}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        Images: e.target.value.split(',').map((url) => url.trim()),
                      }))
                    }
                    placeholder="Image URLs"
                  />

                  <button onClick={() => handleSave(recipe._id)}>Save</button>
                  <button className="cancel-button" onClick={() => setEditIndex(null)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <p><strong>Description:</strong> {recipe.Description}</p>
                  <p><strong>Cook Time:</strong> {recipe.CookTime}</p>
                  <p><strong>Prep Time:</strong> {recipe.PrepTime}</p>
                  <p><strong>Total Time:</strong> {recipe.TotalTime}</p>
                  <p><strong>Category:</strong> {recipe.RecipeCategory}</p>
                  <p><strong>Keywords:</strong> {(recipe.Keywords || []).join(', ')}</p>
                  <p><strong>Ingredient Quantities:</strong> {recipe.RecipeIngredientQuantities}</p>
                  <p><strong>Ingredient Parts:</strong> {recipe.RecipeIngredientParts}</p>
                  <p><strong>Instructions:</strong> {recipe.RecipeInstructions}</p>

                  <button onClick={() => handleEditClick(index)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
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
