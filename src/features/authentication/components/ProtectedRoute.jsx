import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../shared/contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (roles.length > 0 && !roles.some(role => user?.roles?.includes(role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;