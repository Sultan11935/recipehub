// src/pages/RecipeList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserRecipes, deleteRecipe } from '../services/api';
import '../App.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getUserRecipes();
        setRecipes(response.data || []);
      } catch (err) {
        console.error('Error fetching recipes:', err.response ? err.response.data : err.message);
        setError('Failed to fetch recipes');
      }
    };

    fetchRecipes();
  }, []);

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

  return (
    <div className="recipe-list-container">
      <h2>My Recipes</h2>
      <Link to="/add-recipe" className="add-recipe-link">Add New Recipe</Link>

      {error && <p>{error}</p>}

      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe._id} className="recipe-item">
              <Link to={`/recipes/${recipe._id}`}>
                <h3>{recipe.Name}</h3>
              </Link>
              <div className="button-container">
                <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes available.</p>
      )}
    </div>
  );
};

export default RecipeList;
