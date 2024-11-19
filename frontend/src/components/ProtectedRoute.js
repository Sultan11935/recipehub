// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Debugging logs to confirm localStorage retrieval
  console.log('Token in ProtectedRoute:', token);
  console.log('User role in ProtectedRoute:', userRole);
  console.log('Required role for route:', requiredRole);

  if (!token) {
    console.log('No token found. Redirecting to login.');
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(`Role mismatch. User role (${userRole}) does not match required role (${requiredRole}). Redirecting to home.`);
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
