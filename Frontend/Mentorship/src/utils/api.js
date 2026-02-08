/**
 * api.js
 * 
 * Centralized API configuration for backend communication
 * - Base URL configuration
 * - Axios instance with JWT token attachment
 */

import axios from 'axios';

// Backend API base URL
const API_URL = 'http://localhost:4000/api';

/**
 * Create axios instance with interceptor
 * Automatically attaches JWT token to all requests
 */
const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * Request interceptor
 * Adds JWT token to Authorization header before each request
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
