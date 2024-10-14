// src/pages/RecipeList.js
import React, { useEffect, useState } from 'react';
import { getRecipes } from '../services/api';
import { Link } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await getRecipes();
      setRecipes(response.data);
    };
    fetchRecipes();
  }, []);

  return (
    <div>
      <h2>Recipe List</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <Link to={`/recipes/${recipe._id}`}>{recipe.Name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeList;
