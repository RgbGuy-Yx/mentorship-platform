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
  Briefcase,
  Bell,
  Zap,
  Award,
  MapPin,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BlurCard } from '../components/magicui/blur-card';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';

export default function MentorSettings() {
  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [profileCompletion, setProfileCompletion] = useState({
    bio: user?.bio || '',
    skills: user?.skills || '',
    experience: user?.experience || '',
    goals: user?.goals || '',
    currentRole: user?.currentRole || '',
    location: user?.location || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    mentorshipAlerts: true,
    weeklyDigest: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'password', 'notifications'
  const [errors, setErrors] = useState({});

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

    const calculateProfileCompletion = () => {
    const fields = Object.values(profileCompletion);
    const filledFields = fields.filter((field) => field && field.toString().trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

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

    const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

    const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
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

    const handleNotificationChange = (key) => {
    setNotificationPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

    const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.put('/users/profile', {
        fullName: formData.fullName.trim(),
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to update profile');
      }

      const updatedUser = {
        ...user,
        fullName: formData.fullName.trim(),
      };
      login(updatedUser, token);

      toast.success('Profile updated successfully!');
      setErrors({});
    } catch (err) {
        console.error("Error:", err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

    const handleProfileCompletionSave = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await apiClient.put('/users/profile', {
        bio: profileCompletion.bio.trim(),
        skills: profileCompletion.skills.trim(),
        experience: profileCompletion.experience.trim(),
        goals: profileCompletion.goals.trim(),
        currentRole: profileCompletion.currentRole.trim(),
        location: profileCompletion.location.trim(),
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to complete profile');
      }

      const updatedUser = {
        ...user,
        bio: profileCompletion.bio.trim(),
        skills: profileCompletion.skills.trim(),
        experience: profileCompletion.experience.trim(),
        goals: profileCompletion.goals.trim(),
        currentRole: profileCompletion.currentRole.trim(),
        location: profileCompletion.location.trim(),
      };
      login(updatedUser, token);

      toast.success('Profile completed successfully!');
      setErrors({});
    } catch (err) {
        console.error("Error:", err);
      const errorMessage =
        err.response?.data?.message || 'Failed to complete profile. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

    const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to change password');
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('Password changed successfully!');
      setErrors({});
    } catch (err) {
        console.error("Error:", err);
      const errorMessage =
        err.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

    const handleNotificationSave = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await apiClient.put('/users/notification-preferences', {
        preferences: notificationPrefs,
      });

      if (!response.data.success) {
        throw new Error(response.data?.message || 'Failed to update preferences');
      }

      toast.success('Notification preferences updated!');
      setErrors({});
    } catch (err) {
        console.error("Error:", err);
      const errorMessage =
        err.response?.data?.message || 'Failed to update preferences. Please try again.';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page (mentor dashboard)
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 py-8 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-10"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-10"
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -5 }}
          className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 font-medium transition-all shadow-sm hover:shadow-md group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your mentor profile and preferences</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-2 mb-8 bg-white border border-slate-200 rounded-lg p-1 shadow-sm"
        >
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'complete-profile', label: 'Complete Profile', icon: Zap },
            { id: 'password', label: 'Password', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Error Alert */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.form
            onSubmit={handleProfileUpdate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BlurCard className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleProfileChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-50 transition-all focus:outline-none focus:bg-white ${
                    errors.fullName
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-blue-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address
                </label>
                <div className="px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-600 flex items-center gap-2">
                  <Mail size={18} className="text-slate-400" />
                  {formData.email}
                </div>
                <p className="mt-2 text-xs text-slate-500">Email cannot be changed</p>
              </div>

              {/* Account Role Display */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Account Role
                </label>
                <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 capitalize font-medium">
                      {user?.role || 'Mentor'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Mentor
                    </span>
                  </div>
                </div>
              </div>

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
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </BlurCard>
          </motion.form>
        )}

        {/* Complete Profile Tab */}
        {activeTab === 'complete-profile' && (
          <motion.form
            onSubmit={handleProfileCompletionSave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BlurCard className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 space-y-6">
              {/* Profile Completion Progress */}
              <motion.div className="mb-8">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-slate-900">Profile Completion</h3>
                    <motion.div
                      className="text-2xl font-bold text-blue-600"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {calculateProfileCompletion()}%
                    </motion.div>
                  </div>
                  <p className="text-sm text-slate-600">Complete your mentor profile to stand out</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProfileCompletion()}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* Completion Status */}
                <motion.div className="mt-4 space-y-2">
                  {[
                    { name: 'bio', label: 'Bio' },
                    { name: 'skills', label: 'Skills & Expertise' },
                    { name: 'experience', label: 'Experience' },
                    { name: 'goals', label: 'Mentoring Goals' },
                    { name: 'currentRole', label: 'Current Role' },
                    { name: 'location', label: 'Location' },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-3">
                      {profileCompletion[field.name] && profileCompletion[field.name].trim() ? (
                        <CheckCircle size={18} className="text-green-500 shrink-0" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 shrink-0" />
                      )}
                      <span className={`text-sm ${
                        profileCompletion[field.name] && profileCompletion[field.name].trim()
                          ? 'text-slate-900 font-medium'
                          : 'text-slate-500'
                      }`}>
                        {field.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Bio */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <User size={18} className="text-blue-600 shrink-0" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileCompletion.bio}
                  onChange={handleProfileCompletionChange}
                  rows="3"
                  placeholder="Tell students about yourself and your mentoring approach..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Skills & Expertise */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Award size={18} className="text-blue-600 shrink-0" />
                  Skills & Expertise
                </label>
                <input
                  type="text"
                  name="skills"
                  value={profileCompletion.skills}
                  onChange={handleProfileCompletionChange}
                  placeholder="e.g., React, Python, UI/UX Design"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
                <p className="mt-1 text-xs text-slate-500">Separate multiple skills with commas</p>
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600 shrink-0" />
                  Professional Experience
                </label>
                <textarea
                  name="experience"
                  value={profileCompletion.experience}
                  onChange={handleProfileCompletionChange}
                  rows="3"
                  placeholder="Share your professional background and years of experience..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Current Role */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-600 shrink-0" />
                  Current Role
                </label>
                <input
                  type="text"
                  name="currentRole"
                  value={profileCompletion.currentRole}
                  onChange={handleProfileCompletionChange}
                  placeholder="e.g., Senior Software Engineer, Tech Lead"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600 shrink-0" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={profileCompletion.location}
                  onChange={handleProfileCompletionChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Mentoring Goals */}
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Zap size={18} className="text-blue-600 shrink-0" />
                  Mentoring Goals & Vision
                </label>
                <textarea
                  name="goals"
                  value={profileCompletion.goals}
                  onChange={handleProfileCompletionChange}
                  rows="3"
                  placeholder="What are your goals as a mentor? What do you want to help your mentees achieve?"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              {/* Error Message */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50/80 border border-red-200/50 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Complete Profile
                  </>
                )}
              </motion.button>
            </BlurCard>
          </motion.form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <motion.form
            onSubmit={handlePasswordChangeSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BlurCard className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-50 transition-all focus:outline-none focus:bg-white pr-12 ${
                      errors.currentPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-50 transition-all focus:outline-none focus:bg-white pr-12 ${
                      errors.newPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 bg-slate-50 transition-all focus:outline-none focus:bg-white pr-12 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-blue-500'
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Change Password
                  </>
                )}
              </motion.button>
            </BlurCard>
          </motion.form>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.form
            onSubmit={handleNotificationSave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BlurCard className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 space-y-6">
              <p className="text-slate-600 text-sm">
                Manage how you receive notifications about your mentorship activities
              </p>

              {/* Notification Options */}
              <div className="space-y-4">
                {[
                  {
                    key: 'emailNotifications',
                    label: 'Email Notifications',
                    description: 'Receive email alerts for mentorship requests and updates',
                  },
                  {
                    key: 'mentorshipAlerts',
                    label: 'Mentorship Alerts',
                    description: 'Get notified about mentee progress and milestones',
                  },
                  {
                    key: 'weeklyDigest',
                    label: 'Weekly Digest',
                    description: 'Receive a weekly summary of your mentorship activities',
                  },
                ].map((option) => (
                  <motion.div
                    key={option.key}
                    className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <input
                      type="checkbox"
                      id={option.key}
                      checked={notificationPrefs[option.key]}
                      onChange={() => handleNotificationChange(option.key)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={option.key}
                        className="text-sm font-semibold text-slate-900 cursor-pointer block"
                      >
                        {option.label}
                      </label>
                      <p className="text-xs text-slate-600 mt-1">{option.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Saving Preferences...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Preferences
                  </>
                )}
              </motion.button>
            </BlurCard>
          </motion.form>
        )}
      </div>
    </div>
  );
}
