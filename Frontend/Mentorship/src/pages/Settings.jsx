import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Save,
  Loader,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Zap,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BlurCard, SpotlightCard } from '@/components/magicui';
import { DotPattern } from '@/components/ui/dot-pattern';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';

/**
 * Settings Page Component
 * 
 * Allows users to:
 * - Update their profile information (fullName)
 * - Change their password
 * - View account details
 * - Manage account settings
 */
export default function Settings() {
  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state for profile updates
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile completion state
  const [profileCompletion, setProfileCompletion] = useState({
    bio: user?.bio || '',
    dateOfBirth: user?.dateOfBirth || '',
    location: user?.location || '',
    currentRole: user?.currentRole || '',
    skills: user?.skills || '',
    goals: user?.goals || '',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'complete-profile', or 'password'
  const [errors, setErrors] = useState({});

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  /**
   * Validate profile form
   * Returns object with validation errors
   */
  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = 'Full name must be less than 50 characters';
    }

    return newErrors;
  };

  /**
   * Validate password form
   * Returns object with validation errors
   */
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    return newErrors;
  };

  /**
   * Calculate profile completion percentage
   */
  const calculateProfileCompletion = () => {
    const fields = Object.values(profileCompletion);
    const filledFields = fields.filter((field) => field && field.toString().trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  /**
   * Handle profile completion input changes
   */
  const handleProfileCompletionChange = (e) => {
    const { name, value } = e.target;
    setProfileCompletion((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle profile completion submission
   */
  const handleProfileCompletionSave = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await apiClient.put('/users/profile', {
        bio: profileCompletion.bio.trim(),
        dateOfBirth: profileCompletion.dateOfBirth,
        location: profileCompletion.location.trim(),
        currentRole: profileCompletion.currentRole.trim(),
        skills: profileCompletion.skills.trim(),
        goals: profileCompletion.goals.trim(),
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to complete profile');
      }

      const updatedUser = {
        ...user,
        bio: profileCompletion.bio.trim(),
        dateOfBirth: profileCompletion.dateOfBirth,
        location: profileCompletion.location.trim(),
        currentRole: profileCompletion.currentRole.trim(),
        skills: profileCompletion.skills.trim(),
        goals: profileCompletion.goals.trim(),
      };
      login(updatedUser, token);

      toast.success('Profile completed successfully!');
      setErrors({});
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to complete profile. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle profile form input changes
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle password form input changes
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handle profile update submission
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Send update request to backend
      // Note: This endpoint needs to be created in the backend
      const response = await apiClient.put('/users/profile', {
        fullName: formData.fullName.trim(),
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to update profile');
      }

      // Update user in context
      const updatedUser = { ...user, fullName: formData.fullName.trim() };
      login(updatedUser, token);

      // Show success message
      toast.success('Profile updated successfully!');
      setErrors({});
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle password change submission
   */
  const handlePasswordChange_Submit = async (e) => {
    e.preventDefault();

    // Validate form
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Send password change request to backend
      // Note: This endpoint needs to be created in the backend
      const response = await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to change password');
      }

      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Show success message
      toast.success('Password changed successfully!');
      setErrors({});
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 relative overflow-hidden">
      {/* Animated Dot Pattern Background */}
      <DotPattern
        width={30}
        height={30}
        cx={1}
        cy={1}
        cr={1.5}
        className="absolute inset-0 opacity-20"
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/dashboard')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-white/50 text-blue-600 font-medium transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="group-hover:translate-x-[-4px] transition-transform" />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Settings</h1>
          <p className="text-lg text-gray-600">
            Manage your account and update your profile information
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 mb-8"
        >
          <motion.button
            onClick={() => setActiveTab('profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/80 backdrop-blur-sm border border-white/50'
            }`}
          >
            <User size={20} />
            Profile
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('complete-profile')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'complete-profile'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/80 backdrop-blur-sm border border-white/50'
            }`}
          >
            <Zap size={20} />
            Complete Profile
          </motion.button>

          <motion.button
            onClick={() => setActiveTab('password')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'password'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/80 backdrop-blur-sm border border-white/50'
            }`}
          >
            <Lock size={20} />
            Security
          </motion.button>
        </motion.div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <SpotlightCard className="p-8 border border-indigo-100/50">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* Email Display (Read-only) */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail size={18} className="text-blue-600" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-lg bg-gray-100/50 text-gray-600 border border-gray-300/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Email cannot be changed for security reasons
                  </p>
                </motion.div>

                {/* Full Name Input */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName
                        ? 'border-red-500/50 bg-red-50/30'
                        : 'border-indigo-200/50 bg-white/50'
                    }`}
                  />
                  {errors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 mt-2 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.fullName}
                    </motion.p>
                  )}
                </motion.div>

                {/* Account Role Display */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Account Role
                  </label>
                  <div className="px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize font-medium">
                        {user?.role || 'Student'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user?.role === 'mentor'
                            ? 'bg-green-100 text-green-800'
                            : user?.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user?.role === 'mentor' ? 'Mentor' : user?.role === 'admin' ? 'Admin' : 'Student'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50/80 border border-red-200/50 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-red-700 text-sm">{errors.submit}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <ShimmerButton
                    type="submit"
                    disabled={isLoading}
                    background="rgba(37, 99, 235, 1)"
                    className="w-full text-white py-3 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </ShimmerButton>
                </motion.div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'password' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <SpotlightCard className="p-8 border border-indigo-100/50">
              <form onSubmit={handlePasswordChange_Submit} className="space-y-6">
                {/* Current Password */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Lock size={18} className="text-blue-600" />
                      Current Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your current password"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                        errors.currentPassword
                          ? 'border-red-500/50 bg-red-50/30'
                          : 'border-indigo-200/50 bg-white/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 mt-2 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.currentPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* New Password */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Lock size={18} className="text-blue-600" />
                      New Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter your new password (min 6 characters)"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                        errors.newPassword
                          ? 'border-red-500/50 bg-red-50/30'
                          : 'border-indigo-200/50 bg-white/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 mt-2 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.newPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-900 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle size={18} className="text-blue-600" />
                      Confirm New Password
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your new password"
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                        errors.confirmPassword
                          ? 'border-red-500/50 bg-red-50/30'
                          : 'border-indigo-200/50 bg-white/50'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 mt-2 flex items-center gap-1"
                    >
                      <AlertCircle size={14} />
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50/80 border border-red-200/50 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                    <p className="text-red-700 text-sm">{errors.submit}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <ShimmerButton
                    type="submit"
                    disabled={isLoading}
                    background="rgba(37, 99, 235, 1)"
                    className="w-full text-white py-3 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Change Password
                      </>
                    )}
                  </ShimmerButton>
                </motion.div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}

        {/* Complete Profile Tab */}
        {activeTab === 'complete-profile' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <SpotlightCard className="p-8 border border-indigo-100/50">
              {/* Profile Completion Progress */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
                    <p className="text-sm text-gray-600">Complete your profile to stand out</p>
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-blue-600"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {calculateProfileCompletion()}%
                  </motion.div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProfileCompletion()}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* Completion Status */}
                <motion.div className="mt-4 space-y-2" variants={itemVariants}>
                  {[
                    { name: 'bio', label: 'Bio' },
                    { name: 'dateOfBirth', label: 'Date of Birth' },
                    { name: 'location', label: 'Location' },
                    { name: 'currentRole', label: 'Current Role' },
                    { name: 'skills', label: 'Skills' },
                    { name: 'goals', label: 'Goals' },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-3">
                      {profileCompletion[field.name] && profileCompletion[field.name].trim() ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={`text-sm ${
                        profileCompletion[field.name] && profileCompletion[field.name].trim()
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500'
                      }`}>
                        {field.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleProfileCompletionSave} className="space-y-6">
                {/* Bio */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-blue-600" />
                      Bio
                    </div>
                  </label>
                  <textarea
                    name="bio"
                    value={profileCompletion.bio}
                    onChange={handleProfileCompletionChange}
                    rows="3"
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </motion.div>

                {/* Date of Birth */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-blue-600" />
                      Date of Birth
                    </div>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileCompletion.dateOfBirth}
                    onChange={handleProfileCompletionChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </motion.div>

                {/* Location */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-blue-600" />
                      Location
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profileCompletion.location}
                    onChange={handleProfileCompletionChange}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </motion.div>

                {/* Current Role */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-blue-600" />
                      Current Role
                    </div>
                  </label>
                  <input
                    type="text"
                    name="currentRole"
                    value={profileCompletion.currentRole}
                    onChange={handleProfileCompletionChange}
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </motion.div>

                {/* Skills */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Award size={18} className="text-blue-600" />
                      Skills
                    </div>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={profileCompletion.skills}
                    onChange={handleProfileCompletionChange}
                    placeholder="e.g., React, Python, Project Management"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">Separate multiple skills with commas</p>
                </motion.div>

                {/* Goals */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <div className="flex items-center gap-2">
                      <Zap size={18} className="text-blue-600" />
                      Career Goals
                    </div>
                  </label>
                  <textarea
                    name="goals"
                    value={profileCompletion.goals}
                    onChange={handleProfileCompletionChange}
                    rows="3"
                    placeholder="What are your career aspirations?"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </motion.div>

                {/* Error Message */}
                {errors.submit && (
                  <motion.div variants={itemVariants} className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                    <p className="text-red-700 text-sm">{errors.submit}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <ShimmerButton
                    type="submit"
                    disabled={isLoading}
                    background="rgba(37, 99, 235, 1)"
                    className="w-full text-white py-3 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Complete Profile
                      </>
                    )}
                  </ShimmerButton>
                </motion.div>
              </form>
            </SpotlightCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
