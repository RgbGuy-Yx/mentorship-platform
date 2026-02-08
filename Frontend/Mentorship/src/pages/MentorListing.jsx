import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Loader, ArrowLeft, CheckCircle, Search, X, Briefcase, Award, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';
import { SpotlightCard, BlurCard } from '@/components/magicui';
import { DotPattern } from '@/components/ui/dot-pattern';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import MentorProfileModal from '../components/MentorProfileModal';

/**
 * Advanced MentorListing Component
 * 
 * Features:
 * - Search mentors by name, skills, expertise
 * - Filter by domain/expertise and experience level
 * - Rich mentor cards with profile data
 * - Responsive grid layout
 * - Request mentorship with state tracking
 * - Loading and empty states
 * - View mentor profile in modal
 */
export default function MentorListing() {
  const { isLoading: authLoading, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Component state
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestingMentorId, setRequestingMentorId] = useState(null);
  const [requestedMentors, setRequestedMentors] = useState(new Set());

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  // Modal state
  const [selectedMentorId, setSelectedMentorId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Fetch mentors on mount
  useEffect(() => {
    const fetchMentorsAndRequests = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setError('');
        setIsLoading(true);

        const mentorsResponse = await apiClient.get('/users/mentors');

        if (!mentorsResponse.data || !mentorsResponse.data.data) {
          throw new Error(mentorsResponse.data?.message || 'Failed to fetch mentors');
        }

        const mentorsList = mentorsResponse.data.data || [];
        setMentors(mentorsList);
        setFilteredMentors(mentorsList);

        // Fetch student's existing requests
        try {
          const requestsResponse = await apiClient.get('/requests/my-requests');
          if (requestsResponse.data && requestsResponse.data.data) {
            const requestedMentorIds = new Set(
              requestsResponse.data.data.map((req) => req.mentor._id)
            );
            setRequestedMentors(requestedMentorIds);
          }
        } catch (err) {
          console.log('Could not load existing requests');
        }
      } catch (err) {
        let errorMessage = 'Failed to load mentors. Please try again.';

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
      fetchMentorsAndRequests();
    }
  }, [token, navigate, authLoading]);

  // Apply search and filters
  useEffect(() => {
    let results = mentors;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter((mentor) => {
        const nameMatch = mentor.fullName?.toLowerCase().includes(term);
        const skillsMatch = mentor.skills?.toLowerCase().includes(term);
        const bioMatch = mentor.bio?.toLowerCase().includes(term);
        const expertiseMatch = mentor.expertise?.toLowerCase().includes(term);
        return nameMatch || skillsMatch || bioMatch || expertiseMatch;
      });
    }

    // Domain filter
    if (selectedDomain) {
      results = results.filter((mentor) =>
        mentor.expertise?.toLowerCase() === selectedDomain.toLowerCase()
      );
    }

    // Experience filter
    if (selectedExperience) {
      results = results.filter((mentor) => {
        const expText = (mentor.experience || '').toString().toLowerCase();
        if (selectedExperience === 'junior') return expText.includes('1-3') || expText.includes('junior');
        if (selectedExperience === 'mid') return expText.includes('3-7') || expText.includes('mid');
        if (selectedExperience === 'senior') return expText.includes('7+') || expText.includes('senior');
        return true;
      });
    }

    setFilteredMentors(results);
  }, [searchTerm, selectedDomain, selectedExperience, mentors]);

  // Get unique domains from mentors
  const uniqueDomains = [...new Set(mentors.map((m) => m.expertise).filter(Boolean))];

  // Handle mentorship request
  const handleRequestMentorship = async (mentorId) => {
    if (requestedMentors.has(mentorId)) {
      toast.success('Request already sent to this mentor');
      return;
    }

    try {
      setRequestingMentorId(mentorId);

      const response = await apiClient.post('/requests', { mentorId });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to send request');
      }

      setRequestedMentors((prev) => new Set([...prev, mentorId]));
      toast.success('Mentorship request sent!');
    } catch (err) {
      let errorMessage = 'Failed to send request. Please try again.';

      if (err.response?.status === 401) {
        errorMessage = 'Your session expired. Please login again.';
        navigate('/login');
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid request';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server.';
        console.error('Network error:', err.request);
      } else {
        console.error('Error requesting mentorship:', err);
      }

      toast.error(errorMessage);
    } finally {
      setRequestingMentorId(null);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDomain('');
    setSelectedExperience('');
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'M';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3"
        >
          <Loader className="animate-spin text-blue-600" size={28} />
          <p className="text-gray-700 text-lg font-medium">Loading mentors...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 relative overflow-hidden">
      <DotPattern 
        width={30} 
        height={30} 
        cx={1} 
        cy={1} 
        cr={1.5} 
        className="absolute inset-0 opacity-20" 
      />

      <div className="max-w-6xl mx-auto relative z-10">
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
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="mb-12 relative"
        >
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 rounded-3xl blur-3xl -z-10" />
          
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="text-blue-600" size={32} />
            </motion.div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Discover Your Guide
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Browse Mentors
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
            Connect with experienced professionals who can guide your journey. Filter by expertise and find the perfect mentor to accelerate your growth.
          </p>
          
          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Mentors</p>
                <p className="text-2xl font-bold text-gray-900">{mentors.length}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search & Filter Section */}
        {!isLoading && mentors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 space-y-5"
          >
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-blue-400" size={22} />
                <input
                  type="text"
                  placeholder="Search by name, skills, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 placeholder-gray-400 font-medium shadow-lg"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Domain Filter */}
              <div className="relative">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/90 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700 font-medium appearance-none cursor-pointer shadow-md"
                >
                  <option value="">All Domains</option>
                  {uniqueDomains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-3.5 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Experience Filter */}
              <div className="relative">
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white/90 backdrop-blur-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-700 font-medium appearance-none cursor-pointer shadow-md"
                >
                  <option value="">All Experience Levels</option>
                  <option value="junior">Junior (1-3 years)</option>
                  <option value="mid">Mid-level (3-7 years)</option>
                  <option value="senior">Senior (7+ years)</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-3.5 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Clear Filters Button */}
              <motion.button
                onClick={clearFilters}
                disabled={!searchTerm && !selectedDomain && !selectedExperience}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 rounded-lg border-2 border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:border-red-400 hover:from-red-50 hover:to-red-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 hover:text-red-600 font-semibold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <X size={18} />
                Clear Filters
              </motion.button>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedDomain || selectedExperience) && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Search: {searchTerm}
                  </span>
                )}
                {selectedDomain && (
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                    Domain: {selectedDomain}
                  </span>
                )}
                {selectedExperience && (
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                    Experience: {selectedExperience}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="text-blue-600 mb-4" size={40} />
            </motion.div>
            <p className="text-gray-600 text-lg">Loading mentors...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl p-6 mb-8"
          >
            <p className="text-red-700 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Mentors Grid */}
        {!isLoading && filteredMentors.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMentors.map((mentor) => (
              <motion.div
                key={mentor._id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="h-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col hover:border-gray-300 hover:shadow-md transition-all">
                  {/* Header with Avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Simple Avatar */}
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">
                        {getInitials(mentor.fullName)}
                      </span>
                    </div>

                    {/* Verified Badge */}
                    <div className="flex items-center gap-1.5 ml-auto text-xs font-semibold text-green-700">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      Verified
                    </div>
                  </div>

                  {/* Mentor Name */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {mentor.fullName}
                  </h2>

                  {/* Domain / Expertise */}
                  {mentor.expertise && (
                    <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wide">
                      {mentor.expertise}
                    </p>
                  )}

                  {/* Email */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3 text-xs">
                    <Mail size={14} />
                    <span className="truncate">{mentor.email}</span>
                  </div>

                  {/* Bio */}
                  {mentor.bio && (
                    <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {mentor.bio}
                    </p>
                  )}

                  {/* Skills Badges */}
                  {mentor.skills && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(typeof mentor.skills === 'string'
                        ? mentor.skills.split(',').slice(0, 3)
                        : Array.isArray(mentor.skills) ? mentor.skills.slice(0, 3) : []
                      ).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                      {(typeof mentor.skills === 'string'
                        ? mentor.skills.split(',').length
                        : Array.isArray(mentor.skills) ? mentor.skills.length : 0) > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          +{(typeof mentor.skills === 'string'
                            ? mentor.skills.split(',').length
                            : Array.isArray(mentor.skills) ? mentor.skills.length : 0) - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Experience Info */}
                  {mentor.experience && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4 text-xs">
                      <Award size={14} />
                      <span>{mentor.experience}</span>
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-grow" />

                  {/* Button Group */}
                  <div className="flex gap-2">
                    {/* View Profile Button */}
                    <button
                      onClick={() => {
                        setSelectedMentorId(mentor._id);
                        setIsModalOpen(true);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
                    >
                      View Profile
                    </button>

                    {/* Request Button */}
                    {requestedMentors.has(mentor._id) ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 bg-gray-100 text-gray-600 cursor-not-allowed text-sm"
                      >
                        <CheckCircle size={16} />
                        Sent
                      </button>
                    ) : requestingMentorId === mentor._id ? (
                      <ShimmerButton
                        disabled
                        background="rgba(59, 130, 246, 0.6)"
                        className="flex-1 text-white text-sm font-semibold"
                      >
                        <Loader size={14} className="animate-spin" />
                      </ShimmerButton>
                    ) : (
                      <ShimmerButton
                        onClick={() => handleRequestMentorship(mentor._id)}
                        background="rgba(37, 99, 235, 1)"
                        className="flex-1 text-white text-sm font-semibold"
                      >
                        Request
                      </ShimmerButton>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results State */}
        {!isLoading && filteredMentors.length === 0 && mentors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-indigo-500/10 rounded-3xl blur-3xl" />
              <BlurCard className="p-16 text-center relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-2xl">
                    <Search className="text-blue-600" size={48} />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No mentors match your criteria
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                  Try adjusting your search terms or filters to find the perfect mentor for your journey.
                </p>
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg transition-all uppercase tracking-wide"
                >
                  Reset All Filters
                </motion.button>
              </BlurCard>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && mentors.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 rounded-3xl blur-3xl" />
              <BlurCard className="p-16 text-center relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-2xl">
                    <Users className="text-purple-600" size={48} />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No mentors available yet
                </h3>
                <p className="text-gray-600 text-lg mb-6 max-w-lg mx-auto">
                  Our mentor network is growing! Check back soon to discover amazing mentors ready to guide you.
                </p>
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg transition-all uppercase tracking-wide"
                >
                  Back to Dashboard
                </motion.button>
              </BlurCard>
            </div>
          </motion.div>
        )}

        {/* Mentor Profile Modal */}
        <MentorProfileModal
          mentorId={selectedMentorId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
