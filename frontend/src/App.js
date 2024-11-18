// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import UserHome from './pages/UserHome';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Redirect root URL to UserHome if authenticated */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <Landing />}
          />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RecipeList"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RecipeList /> {/* RecipeList accessible at /RecipeList */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/recipes/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <RecipeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-recipe"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddRecipe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
