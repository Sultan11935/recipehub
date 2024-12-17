// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  // Debugging logs to confirm localStorage retrieval
  console.log('Token in ProtectedRoute:', token);
  console.log('User role in ProtectedRoute:', userRole);
  console.log('Required role for route:', requiredRole);
  console.log('Current path:', location.pathname);
  

  if (!token) {
    console.log('No token found. Redirecting to login.');
    return <Navigate to="/login" />;
  }

  // Allow unauthenticated users to access the /search page
  if (location.pathname === '/search') {
    console.log('Unauthenticated access allowed for /search.');
    return children;
  }


  if (requiredRole && userRole !== requiredRole) {
    console.log(`Role mismatch. User role (${userRole}) does not match required role (${requiredRole}). Redirecting to home.`);
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
