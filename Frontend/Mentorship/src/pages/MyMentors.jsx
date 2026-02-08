import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  Send,
  Users,
  Settings,
  LogOut,
  MessageCircle,
  AlertCircle,
  Loader,
  ChevronRight,
  Mail,
  Calendar,
  Star,
  UserCheck,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BlurCard } from '../components/magicui';
import { ShimmerButton } from '../components/ui/shimmer-button';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';
import MentorProfileModal from '../components/MentorProfileModal';

/**
 * MyMentors Component
 * 
 * Display all mentors the student is currently connected with
 * - View mentor details for each active connection
 * - Message mentors
 * - View full mentor profiles
 * - Track connection dates
 */
export default function MyMentors() {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Component state
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Fetch connected mentors (accepted requests) on mount
   */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setError('');
        setIsLoading(true);

        // Fetch all accepted requests to get connected mentors
        const response = await apiClient.get('/requests/my-requests?status=accepted');

        // Validate response structure
        if (!response.data || !response.data.data) {
          throw new Error(response.data?.message || 'Failed to fetch mentors');
        }

        setMentors(response.data.data || []);
      } catch (err) {
        let errorMessage = 'Failed to load your mentors. Please try again.';

        if (err.response?.status === 401) {
          errorMessage = 'Your session expired. Please login again.';
          navigate('/login');
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.request) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
          console.error('Network error:', err.request);
        } else {
          console.error('Error fetching mentors:', err);
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchMentors();
    }
  }, [authLoading, navigate]);

  /**
   * Format date to readable format
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Calculate days since connection
   */
  const getDaysSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Connected today';
    if (diffDays === 1) return 'Connected yesterday';
    if (diffDays < 7) return `Connected ${diffDays} days ago`;
    if (diffDays < 30) return `Connected ${Math.floor(diffDays / 7)} weeks ago`;
    return `Connected ${Math.floor(diffDays / 30)} months ago`;
  };

  // Show loading state
  if (isLoading && mentors.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Loader className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-700 font-medium">Loading your mentors...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* Grid overlay pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, .05) 25%, rgba(99, 102, 241, .05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, .05) 75%, rgba(99, 102, 241, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, .05) 25%, rgba(99, 102, 241, .05) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, .05) 75%, rgba(99, 102, 241, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Header Section */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/60 backdrop-blur-md border-b border-indigo-100/50 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-gray-900">My Mentors</h1>
              <p className="text-gray-600 text-sm mt-1">
                View all your connected mentors
              </p>
            </motion.div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShimmerButton
                onClick={() => navigate('/browse-mentors')}
                className="gap-2"
              >
                <Users size={16} />
                Find More Mentors
              </ShimmerButton>
            </motion.div>
          </div>

          {/* Stats - Minimal style */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-3 mt-6"
          >
            {[
              { label: 'Connected Mentors', value: mentors.length, color: 'text-green-600' },
              { label: 'Active Connections', value: mentors.length, color: 'text-indigo-600' },
              { label: 'Learning', value: `${Math.max(1, Math.floor(mentors.length * 0.5))}`, color: 'text-blue-600' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-indigo-100/30"
              >
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="font-medium text-red-900 text-sm">Error</h3>
              <p className="text-red-800 text-xs mt-0.5">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && mentors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Users size={48} className="text-indigo-300" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors connected yet</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              You haven't connected with any mentors yet. Accept a mentorship request or send one to get started!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ShimmerButton 
                onClick={() => navigate('/browse-mentors')}
                className="gap-2"
              >
                <Compass size={16} />
                Find Mentors
              </ShimmerButton>
            </motion.div>
          </motion.div>
        )}

        {/* Mentors Grid */}
        {!isLoading && mentors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {mentors.map((connection, index) => {
              const mentor = connection.mentor;
              return (
                <motion.div
                  key={connection._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <BlurCard className="overflow-hidden border border-indigo-100/50 backdrop-blur-sm cursor-pointer group h-full flex flex-col">
                    <div className="p-5 bg-white/40 flex-1 flex flex-col">
                      {/* Mentor Avatar & Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.08 }}
                          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                        >
                          <Users className="text-white" size={28} />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {mentor.fullName}
                          </h3>
                          <p className="text-xs text-gray-600 capitalize mt-0.5">
                            {mentor.role === 'admin' ? 'Expert Mentor' : 'Mentor'}
                          </p>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-1 mt-1.5 text-green-600"
                          >
                            <UserCheck size={12} />
                            <span className="text-xs font-medium">Connected</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Email */}
                      <p className="text-xs text-gray-600 flex items-center gap-1.5 mb-4 line-clamp-1">
                        <Mail size={12} />
                        <span className="line-clamp-1">{mentor.email}</span>
                      </p>

                      {/* Connection Date */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs text-gray-500 flex items-center gap-1.5 mb-6"
                      >
                        <Calendar size={12} />
                        <div className="flex flex-col">
                          <span>{formatDate(connection.createdAt)}</span>
                          <span className="text-gray-400">{getDaysSince(connection.createdAt)}</span>
                        </div>
                      </motion.div>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-indigo-100/30">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedMentorId(mentor._id);
                            setIsModalOpen(true);
                          }}
                          className="flex-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-medium text-xs transition-colors"
                        >
                          Profile
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/messages')}
                          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle size={12} />
                          Message
                        </motion.button>
                      </div>
                    </div>
                  </BlurCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Mentor Profile Modal */}
        <MentorProfileModal
          mentorId={selectedMentorId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </motion.div>
  );
}
