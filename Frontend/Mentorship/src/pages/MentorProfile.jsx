import { useState, useEffect, useContext } from 'react';
import { Mail, Loader, X, MapPin, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';

/**
 * MentorProfileModal Component
 * 
 * Clean, minimalistic mentor profile display
 * Features smooth animations and essential information only
 * 
 * Props:
 * - mentorId: ID of the mentor to display
 * - isOpen: Boolean to control modal visibility
 * - onClose: Callback function when modal closes
 */
export default function MentorProfileModal({ mentorId, isOpen, onClose }) {
  // const { id } = useParams();
  const id = mentorId;
  const { isLoading: authLoading, token } = useContext(AuthContext);

  // Component state
  const [mentor, setMentor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch mentor data on mount
  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchMentor = async () => {
      if (!token) {
        toast.error('Please login to view mentor profile');
        onClose();
        return;
      }

      try {
        setError('');
        setIsLoading(true);

        const response = await apiClient.get(`/users/${id}`);

        if (!response.data || !response.data.data) {
          throw new Error(response.data?.message || 'Mentor not found');
        }

        const mentorData = response.data.data;

        // Ensure this is a mentor
        if (mentorData.role !== 'mentor' && mentorData.role !== 'admin') {
          throw new Error('This profile is not a mentor');
        }

        setMentor(mentorData);
      } catch (err) {
        let errorMessage = 'Failed to load mentor profile. Please try again.';

        if (err.response?.status === 401) {
          errorMessage = 'Your session expired. Please login again.';
          onClose();
        } else if (err.response?.status === 404) {
          errorMessage = 'Mentor not found';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.request) {
          errorMessage = 'Unable to connect to server.';
          console.error('Network error:', err.request);
        } else {
          console.error('Error fetching mentor:', err);
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [id, token, isOpen, onClose]);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'M';
  };

  const handleClose = () => {
    onClose();
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Loading state
  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="relative z-10"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <Loader className="text-blue-600" size={32} />
              </motion.div>
              <p className="text-slate-600 text-sm font-medium">Loading mentor profile...</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Error state
  if (error && !mentor) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-slate-700 font-medium mb-4 text-sm">{error}</p>
            <motion.button
              onClick={handleClose}
              className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        {mentor && (
          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-lg border border-slate-100"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 35, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-5 right-5 z-10 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
              whileHover={{ scale: 1.15, backgroundColor: '#f1f5f9' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} className="text-slate-600" />
            </motion.button>

            {/* Header Section - Minimalist */}
            <motion.div
              className="px-6 md:px-8 pt-8 pb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar - Simple Initials */}
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-semibold text-blue-700 shrink-0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 30 }}
                >
                  {getInitials(mentor.fullName)}
                </motion.div>

                {/* Header Info */}
                <motion.div 
                  className="flex-1 pt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.4 }}
                >
                  <h2 className="text-2xl font-semibold text-slate-900 mb-0.5 leading-tight">{mentor.fullName}</h2>
                  <p className="text-sm text-slate-600">Professional Mentor</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div 
              className="px-6 md:px-8 pb-8 space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {/* Expertise */}
              {mentor.expertise && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-sm text-slate-500 font-medium mb-2">Expertise</p>
                  <p className="text-base text-slate-900 font-medium">{mentor.expertise}</p>
                </motion.div>
              )}

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-3 pt-2"
              >
                <Mail size={18} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">Contact</p>
                  <p className="text-sm text-slate-600 break-all">{mentor.email}</p>
                </div>
              </motion.div>

              {/* Location */}
              {mentor.location && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-start gap-3"
                >
                  <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Location</p>
                    <p className="text-sm text-slate-600">{mentor.location}</p>
                  </div>
                </motion.div>
              )}

              {/* Current Role */}
              {mentor.currentRole && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <Briefcase size={18} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Current Role</p>
                    <p className="text-sm text-slate-600">{mentor.currentRole}</p>
                  </div>
                </motion.div>
              )}

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="h-px bg-slate-100 origin-left"
              />

              {/* About Bio */}
              {mentor.bio && mentor.bio.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-slate-500 font-medium mb-2.5">About</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{mentor.bio}</p>
                </motion.div>
              )}

              {/* Skills */}
              {mentor.skills && mentor.skills.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <p className="text-xs text-slate-500 font-medium mb-3">Skills & Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.split(',').map((skill, idx) => (
                      <motion.span
                        key={idx}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-colors cursor-default"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -2 }}
                        transition={{ delay: 0.55 + idx * 0.04, type: 'spring', stiffness: 400 }}
                      >
                        {skill.trim()}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Experience */}
              {mentor.experience && mentor.experience.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-xs text-slate-500 font-medium mb-2.5">Experience</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{mentor.experience}</p>
                </motion.div>
              )}

              {/* Goals */}
              {mentor.goals && mentor.goals.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <p className="text-xs text-slate-500 font-medium mb-2.5">Goals & Vision</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{mentor.goals}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
