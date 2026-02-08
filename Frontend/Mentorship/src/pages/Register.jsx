import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BookOpen, Users, AlertCircle, Loader2 } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation.js';
import LoadingScreen from '../components/LoadingScreen';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear API error when user starts typing
    if (apiError) setApiError('');
  };

  /**
   * Handle signup form submission
   * 
   * Flow:
   * 1. Validate all fields
   * 2. Show loading state
   * 3. Call POST /api/auth/register
   * 4. On success: Show toast, redirect to login
   * 5. On error: Show error message and stop loader
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setApiError('');

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with letters and numbers';
    }

    // If there are validation errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear validation errors if passed
    setErrors({});
    setIsLoading(true);

    try {
      // Create request data object
      const registrationData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        rolePreference: formData.role,
      };

      // Call backend register API
      const response = await apiClient.post('/auth/register', registrationData);

      // Check if response is successful
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Registration failed');
      }

      // Show success message
      const message = response.data.message || 'Registration successful!';
      toast.success(message);

      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      // Stop loading and show error
      setIsLoading(false);
      
      // Enhanced error handling to show specific error messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
        
        // Log detailed error for debugging
        console.error('Registration API Error:', {
          status: err.response.status,
          data: err.response.data,
          message: err.response.data?.message
        });
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check if the backend is running.';
        console.error('Registration Network Error:', err.request);
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage;
        console.error('Registration Error:', err);
      }
      
      setApiError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Us
            </h1>
            <p className="text-sm text-gray-600">
              Create your mentorship account
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
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
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  placeholder="********"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as:
              </label>
              <div className="space-y-2">
                {/* Student Option */}
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                  style={{ 
                    borderColor: formData.role === 'student' ? '#3b82f6' : '#d1d5db',
                    backgroundColor: formData.role === 'student' ? '#eff6ff' : 'white',
                    opacity: isLoading ? 0.5 : 1,
                    pointerEvents: isLoading ? 'none' : 'auto'
                  }}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-blue-600"
                  />
                  <BookOpen className="ml-3 text-blue-600" size={20} />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Student</p>
                    <p className="text-xs text-gray-600">Learn from experienced mentors</p>
                  </div>
                </label>

                {/* Mentor Option */}
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: formData.role === 'mentor' ? '#a855f7' : '#d1d5db',
                    backgroundColor: formData.role === 'mentor' ? '#faf5ff' : 'white',
                    opacity: isLoading ? 0.5 : 1,
                    pointerEvents: isLoading ? 'none' : 'auto'
                  }}>
                  <input
                    type="radio"
                    name="role"
                    value="mentor"
                    checked={formData.role === 'mentor'}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-purple-600"
                  />
                  <Users className="ml-3 text-purple-600" size={20} />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Apply as Mentor</p>
                    <p className="text-xs text-gray-600">Share your expertise with students</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-6 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Login here
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Join thousands of learners and mentors worldwide
        </p>
      </div>
    </div>
  );
}
