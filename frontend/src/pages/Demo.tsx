import React from 'react';
import { Navigate } from 'react-router-dom';

export const Demo: React.FC = () => {
  return <Navigate to="/register" replace />;
};

export default Demo;
