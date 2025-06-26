import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import DashboardLayout from './DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  // 🔄 Update auth state on route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Always show login first */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
