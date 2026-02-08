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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  Filter,
  ChevronRight,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { BlurCard, SpotlightCard } from '../components/magicui';
import { ShimmerButton } from '../components/ui/shimmer-button';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';
import MentorProfileModal from '../components/MentorProfileModal';

export default function Requests() {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
    const fetchRequests = async () => {
      try {
        setError('');
        setIsLoading(true);

        const endpoint = filterStatus === 'all' 
          ? '/requests/my-requests' 
          : `/requests/my-requests?status=${filterStatus}`;
        
        const response = await apiClient.get(endpoint);

        if (!response.data || !response.data.data) {
          throw new Error(response.data?.message || 'Failed to fetch requests');
        }

        setRequests(response.data.data || []);
      } catch (err) {
        console.error("Error:", err);
        let errorMessage = 'Failed to load your mentorship requests. Please try again.';

        if (err.response?.status === 401) {
          errorMessage = 'Your session expired. Please login again.';
          navigate('/login');
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.request) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchRequests();
    }
  }, [authLoading, navigate, filterStatus]);

    const getStatusStyles = (status) => {
    const styles = {
      pending: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        badge: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: 'Pending',
      },
      accepted: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        badge: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: 'Accepted',
      },
      rejected: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        badge: 'bg-red-100 text-red-800',
        icon: XCircle,
        label: 'Rejected',
      },
    };
    return styles[status] || styles.pending;
  };

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

    const getDaysSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading && requests.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 flex items-center justify-center"
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
            <Loader className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-700 font-medium">Loading your requests...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="text-gray-600 text-sm mt-1">
                View all mentorship requests you've sent
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
                <Send size={16} />
                Find Mentor
              </ShimmerButton>
            </motion.div>
          </div>

          {/* Stats - Minimal style */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-4 gap-3 mt-6"
          >
            {[
              { label: 'Total', value: requests.length, color: 'text-blue-600' },
              { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'text-yellow-600' },
              { label: 'Accepted', value: requests.filter(r => r.status === 'accepted').length, color: 'text-green-600' },
              { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'text-red-600' },
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
        {/* Filter Section - Minimal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center gap-2 mb-8"
        >
          {[
            { status: 'all', label: 'All' },
            { status: 'pending', label: 'Pending' },
            { status: 'accepted', label: 'Accepted' },
            { status: 'rejected', label: 'Rejected' },
          ].map((filter) => (
            <motion.button
              key={filter.status}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterStatus(filter.status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === filter.status
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 border border-indigo-100/50 hover:bg-white/80 backdrop-blur-sm'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

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
        {!isLoading && requests.length === 0 && (
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
              <Send size={48} className="text-indigo-300" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              You haven't sent any mentorship requests yet. Start exploring and connect with mentors!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ShimmerButton 
                onClick={() => navigate('/browse-mentors')}
                className="gap-2"
              >
                <Compass size={16} />
                Browse Mentors
              </ShimmerButton>
            </motion.div>
          </motion.div>
        )}

        {/* Requests List */}
        {!isLoading && requests.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="space-y-3"
          >
            {requests.map((request, index) => {
              const statusStyle = getStatusStyles(request.status);
              const StatusIcon = statusStyle.icon;

              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.04 }}
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
                >
                  <BlurCard className="overflow-hidden border border-indigo-100/50 backdrop-blur-sm cursor-pointer group">
                    <div className="p-5 bg-white/40">
                      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                        {/* Left Content */}
                        <div className="flex-1 w-full flex items-center gap-4">
                          <motion.div 
                            whileHover={{ scale: 1.08 }}
                            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0"
                          >
                            <Users className="text-white" size={24} />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {request.mentor.fullName}
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                              <Mail size={12} />
                              {request.mentor.email}
                            </p>
                          </div>
                        </div>

                        {/* Status & Date */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <motion.div 
                            whileHover={{ scale: 1.03 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusStyle.badge}`}
                          >
                            <StatusIcon size={12} />
                            <span>{statusStyle.label}</span>
                          </motion.div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600 flex items-center justify-end gap-1">
                              <Calendar size={12} />
                              {formatDate(request.createdAt)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{getDaysSince(request.createdAt)}</p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedMentorId(request.mentor._id);
                            setIsModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shrink-0"
                        >
                          View
                          <ChevronRight size={16} />
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
