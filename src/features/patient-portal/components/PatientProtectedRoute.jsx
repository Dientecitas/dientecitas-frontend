import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePatientPortal } from '../store/patientContext';

const PatientProtectedRoute = ({ children }) => {
  const { isAuthenticated } = usePatientPortal();

  if (!isAuthenticated) {
    return <Navigate to="/portal/auth" replace />;
  }

  return children;
};

export default PatientProtectedRoute;