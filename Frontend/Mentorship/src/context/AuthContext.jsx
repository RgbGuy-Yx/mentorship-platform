/**
 * AuthContext.jsx
 * 
 * Global authentication context for managing:
 * - User data (id, email, role, fullName)
 * - Authentication state (isAuthenticated, isLoading)
 * - JWT token storage
 */

import { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

/**
 * AuthProvider Component
 * 
 * Wraps the app and provides auth state to all components
 * Automatically checks if user is already logged in on mount
 */
export default function AuthProvider({ children }) {
  // Auth state variables
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  /**
   * Initialize auth on app load
   * Checks both localStorage and sessionStorage for existing token
   */
  useEffect(() => {
    // Check localStorage first (persistent login)
    let savedToken = localStorage.getItem('token');
    
    // If not in localStorage, check sessionStorage (session-only login)
    if (!savedToken) {
      savedToken = sessionStorage.getItem('token');
    }
    
    if (savedToken) {
      // Token exists, user was previously logged in
      setToken(savedToken);
      setIsAuthenticated(true);
      
      // Try to restore user data from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    
    // Done checking, stop loading
    setIsLoading(false);
  }, []);

  /**
   * Login function
   * Stores token and user data in both state and localStorage
   */
  const login = (userData, authToken) => {
    // Save to state
    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);
    
    // Save to localStorage for persistence across page refreshes
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Logout function
   * Clears auth data from both state and all storage (localStorage + sessionStorage)
   */
  const logout = () => {
    // Clear from state
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    
    // Clear from both localStorage and sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  // Context value - all auth data and functions available to components
  const value = {
    user,
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
