/**
 * ProtectedRoute.jsx
 * 
 * CRITICAL: Protects routes that require authentication and specific roles
 * 
 * BEHAVIOR:
 * - If user is NOT authenticated → redirect to /login ONLY ONCE
 * - If user LACKS required role → redirect to their role-specific dashboard
 * - Otherwise → allow access
 * 
 * IMPORTANT: Do NOT perform side-effect redirects. Only return <Navigate /> when needed.
 */

import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * @param {string} requiredRole - Optional role requirement (e.g., 'admin', 'mentor')
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  // Still loading auth state, show nothing to prevent flashing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // NOT AUTHENTICATED → redirect to login ONLY ONCE
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // HAS ROLE REQUIREMENT → check if user has it
  if (requiredRole && user?.role !== requiredRole) {
    // User is authenticated but doesn't have the required role
    // Redirect to their own dashboard based on their actual role
    const correctDashboard = 
      user?.role === 'mentor' ? '/mentor/dashboard' :
      user?.role === 'admin' ? '/admin' :
      '/dashboard';
    
    return <Navigate to={correctDashboard} replace />;
  }

  // USER IS AUTHENTICATED AND HAS REQUIRED ROLE → allow access
  return <Outlet />;
};

export default ProtectedRoute;
