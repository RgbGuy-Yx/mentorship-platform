import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handle input change for email and password
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle login form submission
   * 
   * Flow:
   * 1. Validate email and password are not empty
   * 2. Normalize email (lowercase + trim)
   * 3. Send POST request to /api/auth/login
   * 4. On success: Store token, update context, redirect to dashboard
   * 5. On error: Show error message and stop loader
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate fields are not empty
    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare login credentials
      const credentials = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      };

      // Call backend login API
      const response = await apiClient.post('/auth/login', credentials);

      // Validate response structure
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error(response.data?.message || 'Login failed');
      }

      const { data, message } = response.data;

      // Validate token exists
      if (!data.token) {
        throw new Error('No authentication token received');
      }

      // Store token based on "Remember Me" preference
      if (formData.rememberMe) {
        // Store in localStorage for persistent login
        localStorage.setItem('token', data.token);
      } else {
        // Store in sessionStorage for session-only login
        sessionStorage.setItem('token', data.token);
      }

      // Update AuthContext with user data
      login(
        {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        },
        data.token
      );

      // Show success message
      toast.success(message || 'Login successful!');

      // Redirect based on role
      const redirectPath = 
        data.role === 'mentor' ? '/mentor/dashboard' :
        data.role === 'admin' ? '/admin' :
        '/dashboard';
      
      navigate(redirectPath);
    } catch (err) {
      // Stop loading
      setIsLoading(false);

      // Extract error message
      let errorMessage = 'Login failed. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid email or password';
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please try again.';
        console.error('Network error:', err.request);
      } else {
        errorMessage = err.message || errorMessage;
        console.error('Login error:', err);
      }

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card with Shadow */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-center text-sm text-gray-500 mb-8">
            Login to your mentorship account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2">Remember me</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg mt-6 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-3 text-xs text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Register here
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
}