import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutelogin = ({ children }) => {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');
  
  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If there's a token, allow the user to access the route
  return children;
};

export default PrivateRoutelogin;
