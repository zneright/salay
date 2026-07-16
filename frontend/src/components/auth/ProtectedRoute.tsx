import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { LoadingPage } from '../ui/Loading';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If new user and has not configured their profile, force redirect to onboarding
  if (user.organization === 'Not Set') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
