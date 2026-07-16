import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { GuestRoute } from '../components/auth/GuestRoute';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Landing } from '../pages/Landing';
import { Demo } from '../pages/Demo';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Onboarding } from '../pages/Onboarding';
import { Dashboard } from '../pages/Dashboard';
import { Analytics } from '../pages/Analytics';
import { Chat } from '../pages/Chat';
import { Feedback } from '../pages/Feedback';
import { Settings } from '../pages/Settings';
import { NotFound } from '../pages/NotFound';
import { ToastContainer } from '../components/ui/Toast';
import { CommandPalette } from '../components/ui/CommandPalette';

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Guest Marketing & Authentication Routes */}
        <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
        <Route path="/demo" element={<GuestRoute><Demo /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

        {/* Onboarding Wizard Route */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />

        {/* Protected Dashboard Panel Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="chat" element={<Chat />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global overlays */}
      <ToastContainer />
      <CommandPalette />
    </>
  );
};
