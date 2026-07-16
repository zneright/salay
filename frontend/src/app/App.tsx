import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import { AppRoutes } from '../routes/AppRoutes';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { AuthProvider } from '../providers/AuthProvider';
import { GuidedTour } from '../components/ui/GuidedTour';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <GuidedTour />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
export default App;

