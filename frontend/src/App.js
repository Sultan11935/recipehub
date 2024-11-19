// src/App.js
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
            element={
              <ProtectedRoute>
                <RecipeDetail />
              </ProtectedRoute>
            }
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

          {/* Admin-only Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLanding />
              </ProtectedRoute>
            }
          />

          {/* Manage Users - Admin-only route */}
          <Route
            path="/manage-users"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />


        </Routes>
      </div>
    </Router>
  );
};

export default App;
