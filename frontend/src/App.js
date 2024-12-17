import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import UserHome from './pages/UserHome';
import AdminLanding from './pages/AdminLanding';
import ManageUsers from './pages/ManageUsers';
import ManageRecipes from './pages/ManageRecipes';
import ViewReports from './pages/ViewReports';
import ManageRatings from './pages/ManageRatings';
import RecipeReviews from './pages/RecipeReviews'; // Import new page for reviews
import SearchRecipes from './pages/SearchRecipes';
import AddReview from './pages/AddReview';
import UserReviews from './pages/UserReviews';
import TopPopularRecipes from './pages/TopPopularRecipes';
import FastestRecipes from './pages/FastestRecipes';
import CategoryReport from './pages/CategoryReport';
import TopActiveUsers from './pages/TopActiveUsers';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Landing />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Home Route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            }
          />

          {/* Recipe Routes */}
          <Route
            path="/RecipeList"
            element={
              <ProtectedRoute>
                <RecipeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={<RecipeDetail />}
          />
          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Rating and Reviews Routes */}
          <Route
            path="/recipes/:recipeId/reviews"
            element={<RecipeReviews />}
          />
          <Route
            path="/recipes/:recipeId/add-review"
            element={
              <ProtectedRoute>
                <AddReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:recipeId/update-review"
            element={
              <ProtectedRoute>
                <AddReview />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-recipes"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageRecipes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-reviews"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageRatings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <ViewReports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/categories"
            element={
              <ProtectedRoute requiredRole="admin">
                <CategoryReport />
              </ProtectedRoute>
            }
          />

          {/* Search and Ratings Routes */}
          <Route
            path="/search"
            element={<SearchRecipes />}
          />
          <Route
            path="/my-ratings"
            element={
              <ProtectedRoute>
                <UserReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/top-recipes"
            element={<TopPopularRecipes />}
          />

          <Route
            path="/fastest-recipes"
            element={<FastestRecipes />}
          />

          <Route
            path="/reports/top-active-users"
            element={
              
                <TopActiveUsers />
              
            }
          />

        </Routes>
      </div>
    </Router>
  );
};

console.log('API routes initialized for /ratings');

export default App;
