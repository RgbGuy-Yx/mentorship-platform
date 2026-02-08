import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MentorSettings from './MentorSettings';
import StudentProfileCard from '../components/StudentProfileCard';
import {
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Settings,
  LogOut,
  AlertCircle,
  Loader,
  TrendingUp,
  Eye,
  Menu,
  X,
  ChevronRight,
  FilterX,
  BookOpen,
  Users,
  Briefcase,
  BarChart3,
  MessageSquare,
  Bell,
  MoreVertical,
  Activity,
  Target,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SpotlightCard, BlurCard } from '../components/magicui';
import { ShimmerButton } from '../components/ui/shimmer-button';
import apiClient from '../utils/api';
import toast from 'react-hot-toast';

export default function MentorDashboard() {
  const { user, isLoading: authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningRequestId, setActioningRequestId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard' or 'mentees'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentProfile, setShowStudentProfile] = useState(false);

    useEffect(() => {
    const fetchRequests = async () => {
      try {
        setError('');
        setIsLoading(true);

        const response = await apiClient.get('/requests');

        if (!response.data || !response.data.data) {
          throw new Error(response.data?.message || 'Failed to fetch requests');
        }

        setRequests(response.data.data || []);
      } catch (err) {
        console.error("Error:", err);
        let errorMessage = 'Failed to load mentorship requests. Please try again.';

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
  }, [authLoading, navigate]);

    const handleRequestAction = async (requestId, status) => {
    try {
      setActioningRequestId(requestId);

      const response = await apiClient.patch(`/requests/${requestId}`, {
        status,
      });

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Failed to update request');
      }

      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );

      const actionText = status === 'accepted' ? 'accepted' : 'rejected';
      toast.success(`Request ${actionText}!`);
    } catch (err) {
        console.error("Error:", err);
      let errorMessage = 'Failed to update request. Please try again.';

      if (err.response?.status === 401) {
        errorMessage = 'Your session expired. Please login again.';
        navigate('/login');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server.';
      } else {
      }

      toast.error(errorMessage);
    } finally {
      setActioningRequestId(null);
    }
  };

    const stats = {
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    total: requests.length,
  };

    const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
      {/* Animated Background Elements */}
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

      {/* Main Container */}
      <div className="flex h-screen overflow-hidden relative z-20">
        {/* Sidebar Navigation */}
        <motion.div
          className="hidden lg:flex flex-col w-72 border-r border-slate-200 bg-white shadow-sm overflow-y-auto"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-100">
            <motion.button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                M
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-900">Mentorship</h1>
                <p className="text-xs text-slate-500">Platform</p>
              </div>
            </motion.button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { icon: Home, label: 'Home', id: 'dashboard', badge: null },
              { icon: BookOpen, label: 'My Mentees', id: 'mentees', badge: stats.accepted },
              { icon: Settings, label: 'Settings', id: 'settings', badge: null },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  if (item.id === 'dashboard' && item.label === 'Home') {
                    navigate('/');
                  } else {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between text-sm font-medium group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200">
            <motion.button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-lg"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <span className="font-bold text-lg">Mentorship</span>
                  </div>
                </div>
                <nav className="p-4 space-y-2">
                  {[
                    { icon: Home, label: 'Home', id: 'dashboard' },
                    { icon: BookOpen, label: 'My Mentees', id: 'mentees' },
                    { icon: Settings, label: 'Settings', id: 'settings' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-sm font-medium ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Header */}
          <motion.div
            className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm"
            initial={{ y: -60 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 py-4 flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="hidden sm:block">
                  <p className="text-3xl font-bold text-slate-900">Hello, {user?.fullName?.split(' ')[0] || 'Mentor'}</p>
                  <p className="text-sm text-slate-500 mt-1">Track your mentorship journey</p>
                </div>
              </div>

              {/* Right Section - Search & Profile */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:block relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                  />
                </div>

                <motion.button className="p-2 hover:bg-slate-100 rounded-lg relative" whileHover={{ scale: 1.1 }}>
                  <Bell size={22} className="text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </motion.button>

                <motion.div
                  className="flex items-center gap-3 pl-4 border-l border-slate-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{user?.fullName || 'Mentor'}</p>
                    <p className="text-xs text-slate-500">Mentor</p>
                  </div>
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                  >
                    {user?.fullName?.charAt(0) || 'M'}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="p-6 lg:p-8">
            {activeSection === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Statistics Cards */}
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, staggerChildren: 0.1 }}
                  >
                    {[
                      { label: 'Total Requests', value: stats.total, icon: Briefcase, color: 'blue' },
                      { label: 'Pending', value: stats.pending, icon: Clock, color: 'yellow' },
                      { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'green' },
                      { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'red' },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className={`bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all cursor-pointer`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                              <motion.p
                                className="text-3xl font-bold text-slate-900 mt-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {stat.value}
                              </motion.p>
                            </div>
                            <stat.icon size={28} className={`text-${stat.color}-500 opacity-60`} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Current Requests Section */}
                  <motion.div
                    className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {/* Section Header */}
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen size={24} className="text-blue-600" />
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">Mentorship Requests</h2>
                          <p className="text-xs text-slate-500">Manage your incoming requests</p>
                        </div>
                      </div>
                      <motion.button
                        className="p-2 hover:bg-slate-100 rounded-lg"
                        whileHover={{ rotate: 90 }}
                      >
                        <MoreVertical size={20} className="text-slate-400" />
                      </motion.button>
                    </div>

                    {/* Filter Buttons */}
                    {requests.length > 0 && (
                      <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-2">
                        {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                          <motion.button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              filterStatus === status
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                      <motion.div className="flex flex-col items-center justify-center py-12 px-6">
                        <Loader className="animate-spin text-blue-600 mb-3" size={40} />
                        <p className="text-slate-600 font-medium">Loading requests...</p>
                      </motion.div>
                    )}

                    {/* Error State */}
                    <AnimatePresence>
                      {error && !isLoading && (
                        <motion.div
                          className="m-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                          <p className="text-red-700 text-sm font-medium">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Requests List */}
                    <AnimatePresence mode="popLayout">
                      {!isLoading && filteredRequests.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {filteredRequests.map((request, idx) => (
                            <RequestCard
                              key={request._id}
                              request={request}
                              onAction={handleRequestAction}
                              onViewProfile={(student) => {
                                setSelectedStudent(student);
                                setShowStudentProfile(true);
                              }}
                              isActioning={actioningRequestId === request._id}
                              delay={idx * 0.1}
                            />
                          ))}
                        </div>
                      ) : !isLoading && !error ? (
                        <motion.div
                          className="p-12 text-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <EmptyState filterStatus={filterStatus} />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Right Column - Activity & Info */}
                <div className="space-y-6">
                  {/* Date & Time Card */}
                  <motion.div
                    className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-slate-900">Today</h3>
                      <Bell size={20} className="text-slate-400" />
                    </div>
                    <motion.p className="text-3xl font-bold text-slate-900">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </motion.p>
                    <p className="text-slate-500 text-sm mt-2">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </motion.div>

                  {/* Performance Card */}
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Target size={20} className="text-blue-600" />
                      <h3 className="text-sm font-semibold text-slate-900">Performance</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Response Rate', value: '94%', color: 'bg-green-500' },
                        { label: 'Acceptance Rate', value: `${stats.accepted}/${stats.total}`, color: 'bg-blue-500' },
                      ].map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-slate-600">{metric.label}</p>
                            <p className="text-sm font-semibold text-slate-900">{metric.value}</p>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full ${metric.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: metric.label === 'Response Rate' ? '94%' : '60%' }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Activity Feed */}
                  <motion.div
                    className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                      <Activity size={20} className="text-blue-600" />
                      <h3 className="text-sm font-semibold text-slate-900">Activity</h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                      {requests.slice(0, 4).map((req, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            req.status === 'pending' ? 'bg-yellow-500' :
                            req.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 font-medium">{req.studentId?.fullName || 'Student'}</p>
                            <p className="text-xs text-slate-500 capitalize">{req.status} request</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {activeSection === 'mentees' && (
              <MyMenteesSection
                requests={requests}
                isLoading={isLoading}
                error={error}
                onViewProfile={(student) => {
                  setSelectedStudent(student);
                  setShowStudentProfile(true);
                }}
              />
            )}

            {activeSection === 'settings' && (
              <MentorSettings />
            )}
          </div>
        </div>

        {/* Student Profile Modal */}
        <StudentProfileCard
          student={selectedStudent}
          isOpen={showStudentProfile}
          onClose={() => {
            setShowStudentProfile(false);
            setSelectedStudent(null);
          }}
        />
      </div>
    </div>
  );
}

function MyMenteesSection({ requests, isLoading, error, onViewProfile }) {
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">My Mentees</h1>
        <p className="text-slate-600">Manage your active mentorship relationships</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0 }}
          className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
        >
          <p className="text-slate-600 text-sm font-medium">Active Mentees</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{acceptedRequests.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
        >
          <p className="text-slate-600 text-sm font-medium">Total Requests</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">{requests.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-sm"
        >
          <p className="text-slate-600 text-sm font-medium">Success Rate</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {requests.length > 0 ? Math.round((acceptedRequests.length / requests.length) * 100) : 0}%
          </p>
        </motion.div>
      </div>

      {/* Mentees List */}
      <motion.div
        className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <Users size={24} className="text-green-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Mentees</h2>
            <p className="text-xs text-slate-500">Students you are currently mentoring</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div className="flex flex-col items-center justify-center py-12 px-6">
            <Loader className="animate-spin text-blue-600 mb-3" size={40} />
            <p className="text-slate-600 font-medium">Loading mentees...</p>
          </motion.div>
        )}

        {/* Error State */}
        <AnimatePresence>
          {error && !isLoading && (
            <motion.div
              className="m-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mentees List */}
        <AnimatePresence mode="popLayout">
          {!isLoading && acceptedRequests.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {acceptedRequests.map((mentee, idx) => (
                <motion.div
                  key={mentee._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-6 py-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Mentee Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
                        whileHover={{ scale: 1.1 }}
                      >
                        {(mentee.student?.fullName || mentee.studentName || 'Student')?.charAt(0) || 'S'}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-slate-900 truncate">
                          {mentee.student?.fullName || mentee.studentName || mentee.student?.name || 'Student Mentee'}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Mentee since {new Date(mentee.createdAt || mentee.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        onClick={() => onViewProfile(mentee.student)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={16} />
                        View Profile
                      </motion.button>
                      <motion.button
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare size={16} />
                        Message
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : !isLoading && !error ? (
            <motion.div
              className="p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Users className="text-slate-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No active mentees yet</h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                Start accepting mentorship requests to build your mentee list. When you accept a request, the student will appear here.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function RequestCard({ request, onAction, onViewProfile, isActioning, delay }) {
  const getStatusConfig = (status) => {
    const configs = {
      pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800', icon: Clock },
      accepted: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return configs[status] || configs.pending;
  };

  const config = getStatusConfig(request.status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
      whileHover={{ backgroundColor: '#f8fafc' }}
      className="px-6 py-4 border-b border-slate-100 last:border-0 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Request Info */}
        <motion.div className="flex items-center gap-4 flex-1" whileHover={{ x: 2 }}>
          {/* Avatar */}
          <motion.div
            className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md"
            whileHover={{ scale: 1.1 }}
          >
            {(request.student?.fullName || request.studentName || 'Student')?.charAt(0) || 'S'}
          </motion.div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-slate-900 truncate">
              {request.student?.fullName || request.studentName || request.student?.name || 'Student'}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <Clock size={14} />
              <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Status Badge */}
          <motion.span
            className={`inline-flex items-center gap-1.5 ${config.badge} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
            whileHover={{ scale: 1.05 }}
          >
            <StatusIcon size={14} />
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </motion.span>
        </motion.div>

        {/* Action Buttons */}
        <AnimatePresence>
          {request.status === 'pending' && (
            <motion.div
              className="flex items-center gap-3 md:ml-4 flex-wrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {/* View Profile Button */}
              <motion.button
                onClick={() => onViewProfile(request.student)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={16} />
                <span className="hidden sm:inline">View Profile</span>
              </motion.button>

              {/* Accept Button */}
              <motion.button
                onClick={() => onAction(request._id, 'accepted')}
                disabled={isActioning}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActioning ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span className="hidden sm:inline">Accept</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    <span className="hidden sm:inline">Accept</span>
                  </>
                )}
              </motion.button>

              {/* Reject Button */}
              <motion.button
                onClick={() => onAction(request._id, 'rejected')}
                disabled={isActioning}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActioning ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span className="hidden sm:inline">Reject</span>
                  </>
                ) : (
                  <>
                    <XCircle size={16} />
                    <span className="hidden sm:inline">Reject</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function EmptyState({ filterStatus }) {
  const messages = {
    all: {
      title: 'No mentorship requests yet',
      description: 'When students request your mentorship, they will appear here.',
      icon: BookOpen,
    },
    pending: {
      title: 'No pending requests',
      description: 'You have processed all your pending mentorship requests.',
      icon: CheckCircle,
    },
    accepted: {
      title: 'No accepted requests yet',
      description: 'Start accepting mentorship requests to build your mentor profile.',
      icon: Target,
    },
    rejected: {
      title: 'No rejected requests',
      description: 'You haven\'t rejected any requests yet.',
      icon: XCircle,
    },
  };

  const message = messages[filterStatus] || messages.all;
  const Icon = message.icon;

  return (
    <div className="text-center py-12">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4 }}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <Icon className="text-slate-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{message.title}</h3>
        <p className="text-slate-600 max-w-sm mx-auto">{message.description}</p>
      </motion.div>
    </div>
  );
}
