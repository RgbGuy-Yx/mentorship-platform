import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Clock, AlertCircle, Users, TrendingUp, Mail, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/api';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pendingMentors, setPendingMentors] = useState([]);
  const [approvedMentors, setApprovedMentors] = useState([]);
  const [rejectedMentors, setRejectedMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actioningId, setActioningId] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Fetch pending mentors on mount
  useEffect(() => {
    const fetchPendingMentors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get('/admin/pending-mentors');
        
        if (response.data.success) {
          setPendingMentors(response.data.data || []);
          setStats(prev => ({
            ...prev,
            pending: response.data.data.length
          }));
        } else {
          setError(response.data.message || 'Failed to fetch pending mentors');
          toast.error(response.data.message || 'Failed to fetch pending mentors');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Error fetching pending mentors';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('❌ Error fetching pending mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingMentors();
  }, []);

  // Fetch approved mentors
  const fetchApprovedMentors = async () => {
    try {
      const response = await apiClient.get('/admin/approved-mentors');
      if (response.data.success) {
        setApprovedMentors(response.data.data || []);
        setStats(prev => ({
          ...prev,
          approved: response.data.data.length
        }));
      }
    } catch (err) {
      console.error('Error fetching approved mentors:', err);
      toast.error('Failed to fetch approved mentors');
    }
  };

  // Fetch rejected mentors
  const fetchRejectedMentors = async () => {
    try {
      const response = await apiClient.get('/admin/rejected-mentors');
      if (response.data.success) {
        setRejectedMentors(response.data.data || []);
        setStats(prev => ({
          ...prev,
          rejected: response.data.data.length
        }));
      }
    } catch (err) {
      console.error('Error fetching rejected mentors:', err);
      toast.error('Failed to fetch rejected mentors');
    }
  };

  // Handle tab change
  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'approved' && approvedMentors.length === 0) {
      await fetchApprovedMentors();
    } else if (tab === 'rejected' && rejectedMentors.length === 0) {
      await fetchRejectedMentors();
    }
  };

  // Handle approve mentor
  const handleApproveMentor = async (mentorId) => {
    try {
      setActioningId(mentorId);
      const response = await apiClient.patch(`/admin/mentor/${mentorId}`, {
        status: 'approved',
      });

      if (response.data.success) {
        const approvedMentor = pendingMentors.find(m => m._id === mentorId);
        setPendingMentors(pendingMentors.filter(m => m._id !== mentorId));
        if (approvedMentor) {
          setApprovedMentors([...approvedMentors, { ...approvedMentor, mentorStatus: 'approved' }]);
        }
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
        toast.success('✓ Mentor approved successfully', {
          icon: '🎉',
        });
      } else {
        toast.error(response.data.message || 'Failed to approve mentor');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error approving mentor';
      toast.error(errorMessage);
      console.error('❌ Error approving mentor:', err);
    } finally {
      setActioningId(null);
    }
  };

  // Handle reject mentor
  const handleRejectMentor = async (mentorId) => {
    try {
      setActioningId(mentorId);
      const response = await apiClient.patch(`/admin/mentor/${mentorId}`, {
        status: 'rejected',
      });

      if (response.data.success) {
        const rejectedMentor = pendingMentors.find(m => m._id === mentorId);
        setPendingMentors(pendingMentors.filter(m => m._id !== mentorId));
        if (rejectedMentor) {
          setRejectedMentors([...rejectedMentors, { ...rejectedMentor, mentorStatus: 'rejected' }]);
        }
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1,
          rejected: prev.rejected + 1
        }));
        toast.success('✓ Mentor rejected', {
          icon: '✓',
        });
      } else {
        toast.error(response.data.message || 'Failed to reject mentor');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error rejecting mentor';
      toast.error(errorMessage);
      console.error('❌ Error rejecting mentor:', err);
    } finally {
      setActioningId(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            className="inline-flex items-center justify-center mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-900"></div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 font-medium"
          >
            Loading mentors...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const mentorRowVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="border-b border-slate-200 bg-white sticky top-0 z-50"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Panel</h1>
              <p className="text-sm text-slate-600 mt-1">Mentor approval management</p>
            </motion.div>
            <motion.div
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
              </motion.div>
              <span className="text-sm font-medium text-slate-700">Admin</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pending Card */}
          <motion.div
            variants={itemVariants}
            className="group relative"
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
            ></motion.div>
            <div className="relative bg-white rounded-xl border border-slate-200 p-6 hover:border-amber-300 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pending Review</p>
                  <motion.p
                    key={pendingMentors.length}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-slate-900 mt-2"
                  >
                    {pendingMentors.length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-amber-50 rounded-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Clock className="w-6 h-6 text-amber-600" />
                </motion.div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">Waiting for your action</p>
              </div>
            </div>
          </motion.div>

          {/* Approved Card */}
          <motion.div
            variants={itemVariants}
            className="group relative"
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl opacity-0 group-hover:opacity-10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
            ></motion.div>
            <div className="relative bg-white rounded-xl border border-slate-200 p-6 hover:border-green-300 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Mentors</p>
                  <motion.p
                    key={stats.approved}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-slate-900 mt-2"
                  >
                    {stats.approved + pendingMentors.length}
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-green-50 rounded-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Users className="w-6 h-6 text-green-600" />
                </motion.div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">{stats.approved} approved</p>
              </div>
            </div>
          </motion.div>

          {/* Activity Card */}
          <motion.div
            variants={itemVariants}
            className="group relative"
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-10"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.1 }}
            ></motion.div>
            <div className="relative bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Approval Rate</p>
                  <motion.p
                    key={stats.rejected}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-4xl font-bold text-slate-900 mt-2"
                  >
                    {stats.approved + stats.rejected > 0 
                      ? Math.round((stats.approved / (stats.approved + stats.rejected)) * 100)
                      : 0}%
                  </motion.p>
                </div>
                <motion.div
                  className="p-3 bg-blue-50 rounded-lg"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </motion.div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">{stats.rejected} rejected</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          {/* Card Header with Tabs */}
          <motion.div
            className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage mentor applications and approvals
                </p>
              </div>
              {(activeTab === 'pending' && pendingMentors.length > 0) && (
                <motion.div
                  className="px-3 py-1 bg-amber-100 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.8 }}
                >
                  <span className="text-xs font-medium text-amber-700">
                    {pendingMentors.length} awaiting
                  </span>
                </motion.div>
              )}
            </div>

            {/* Tab Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'pending', label: 'Pending', icon: Clock, color: 'amber', count: stats.pending },
                { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'green', count: stats.approved },
                { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'red', count: stats.rejected },
              ].map((tab, index) => {
                const Icon = tab.icon;
                const colorClasses = {
                  amber: activeTab === tab.id ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
                  green: activeTab === tab.id ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
                  red: activeTab === tab.id ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200',
                };

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border ${colorClasses[tab.color]}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <motion.span
                      key={tab.count}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 text-xs font-semibold"
                    >
                      {tab.count}
                    </motion.span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'pending' && (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {pendingMentors.length === 0 ? (
                  <motion.div
                    className="px-6 py-16 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="w-8 h-8 text-amber-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 mt-4">No pending applications</h3>
                    <p className="text-slate-600 text-sm mt-2">
                      All mentor applications have been reviewed.
                    </p>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    <AnimatePresence mode="popLayout">
                      {pendingMentors.map((mentor, index) => (
                        <MentorRow key={mentor._id} mentor={mentor} index={index} activeTab={activeTab} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'approved' && (
              <motion.div
                key="approved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {approvedMentors.length === 0 ? (
                  <motion.div
                    className="px-6 py-16 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 mt-4">No approved mentors yet</h3>
                    <p className="text-slate-600 text-sm mt-2">
                      Approved mentors will appear here.
                    </p>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    <AnimatePresence mode="popLayout">
                      {approvedMentors.map((mentor, index) => (
                        <MentorRowReadOnly key={mentor._id} mentor={mentor} index={index} status="approved" />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'rejected' && (
              <motion.div
                key="rejected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {rejectedMentors.length === 0 ? (
                  <motion.div
                    className="px-6 py-16 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <XCircle className="w-8 h-8 text-red-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-slate-900 mt-4">No rejected mentors</h3>
                    <p className="text-slate-600 text-sm mt-2">
                      Rejected mentors will appear here.
                    </p>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    <AnimatePresence mode="popLayout">
                      {rejectedMentors.map((mentor, index) => (
                        <MentorRowReadOnly key={mentor._id} mentor={mentor} index={index} status="rejected" />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );

  // Mentor Row Component with Action Buttons (for pending)
  function MentorRow({ mentor, index, activeTab }) {
    return (
      <motion.div
        variants={mentorRowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ delay: index * 0.08 }}
        layout
        className="px-6 py-5 hover:bg-slate-50 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-6">
          {/* Mentor Info */}
          <div className="flex-1 flex gap-4">
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: index * 0.08 + 0.2 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-blue-100"
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                {mentor.fullName.charAt(0).toUpperCase()}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 + 0.1 }}
            >
              <h3 className="font-semibold text-slate-900 truncate">
                {mentor.fullName}
              </h3>
              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {mentor.email}
              </p>

              {/* Details Grid */}
              <motion.div
                className="flex flex-wrap gap-4 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.2 }}
              >
                {mentor.currentRole && (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{mentor.currentRole}</span>
                  </motion.div>
                )}
                {mentor.skills && (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                      {mentor.skills}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Bio */}
              {mentor.bio && (
                <motion.p
                  className="text-sm text-slate-600 mt-2 line-clamp-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.25 }}
                >
                  {mentor.bio}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-3 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + 0.15 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleApproveMentor(mentor._id)}
              disabled={actioningId === mentor._id}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 -z-10"
                initial={{ scaleX: 0 }}
              ></motion.div>
              <CheckCircle className="w-4 h-4" />
              <span>{actioningId === mentor._id ? 'Processing...' : 'Approve'}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRejectMentor(mentor._id)}
              disabled={actioningId === mentor._id}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-red-600 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 -z-10"
                initial={{ scaleX: 0 }}
              ></motion.div>
              <XCircle className="w-4 h-4" />
              <span>{actioningId === mentor._id ? 'Processing...' : 'Reject'}</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Read-only Mentor Row (for approved/rejected)
  function MentorRowReadOnly({ mentor, index, status }) {
    const statusConfig = {
      approved: { color: 'green', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'red', icon: XCircle, label: 'Rejected' },
    };
    const config = statusConfig[status];
    const StatusIcon = config.icon;

    return (
      <motion.div
        variants={mentorRowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ delay: index * 0.08 }}
        layout
        className="px-6 py-5 hover:bg-slate-50 transition-colors duration-200"
      >
        <div className="flex items-start justify-between gap-6">
          {/* Mentor Info */}
          <div className="flex-1 flex gap-4">
            <motion.div
              className="flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: index * 0.08 + 0.2 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-semibold text-lg ring-2 ring-slate-200"
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                {mentor.fullName.charAt(0).toUpperCase()}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 + 0.1 }}
            >
              <h3 className="font-semibold text-slate-900 truncate">
                {mentor.fullName}
              </h3>
              <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                <Mail className="w-4 h-4" />
                {mentor.email}
              </p>

              {/* Details Grid */}
              <motion.div
                className="flex flex-wrap gap-4 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.08 + 0.2 }}
              >
                {mentor.currentRole && (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ x: 5 }}
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{mentor.currentRole}</span>
                  </motion.div>
                )}
                {mentor.skills && (
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {mentor.skills}
                    </span>
                  </motion.div>
                )}
              </motion.div>

              {/* Bio */}
              {mentor.bio && (
                <motion.p
                  className="text-sm text-slate-600 mt-2 line-clamp-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.25 }}
                >
                  {mentor.bio}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Status Badge */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 + 0.15 }}
          >
            <motion.div
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <StatusIcon className="w-4 h-4" />
              <span className="font-medium text-sm">{config.label}</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
}
