import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Send,
  Users,
  ArrowRight,
  Zap,
  TrendingUp,
  Home,
  Compass,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
  Star,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Lightbulb,
  Target,
  Flame,
  BarChart3,
  Code,
  Palette,
  Database,
  Loader,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { SpotlightCard, BlurCard, NumberTicker, TextReveal } from '../components/magicui';
import { ShimmerButton } from '../components/ui/shimmer-button';
import { Marquee } from '../components/ui/marquee';
import { DottedMap } from '../components/ui/dotted-map';

/**
 * Enhanced Dashboard Component with Magic UI
 * 
 * Modern student dashboard inspired by Skillio with:
 * - Sidebar navigation structure
 * - Enhanced hero section with magic UI components
 * - Stat cards with animated numbers
 * - Spotlight cards for mentors
 * - Responsive layout
 */
export default function Dashboard() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Mock data
  const stats = {
    requestsSent: 3,
    requestsCompleted: 1,
    mentorsConnected: 2,
    pointsEarned: 240,
    totalPoints: 500,
  };

  const progressPercent = (stats.mentorsConnected / 5) * 100;

  const featuredMentors = [
    {
      id: 1,
      name: 'Sarah Johnson',
      specialty: 'Full Stack Development',
      icon: Code,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Mike Chen',
      specialty: 'Product Design',
      icon: Palette,
      color: 'purple',
    },
    {
      id: 3,
      name: 'Emma Davis',
      specialty: 'Data Science',
      icon: Database,
      color: 'green',
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      specialty: 'Cloud Architecture',
      icon: Code,
      color: 'blue',
    },
    {
      id: 5,
      name: 'Lisa Wang',
      specialty: 'UI/UX Design',
      icon: Palette,
      color: 'purple',
    },
    {
      id: 6,
      name: 'James Martin',
      specialty: 'Machine Learning',
      icon: Database,
      color: 'green',
    },
  ];

  // Mentor Card Component
  const MentorCard = ({ mentor }) => (
    <div className="flex-shrink-0 w-full max-w-sm">
      <SpotlightCard className="overflow-hidden group cursor-pointer h-full hover:shadow-2xl transition-all duration-300">
        <div className="p-4 h-full flex flex-row items-center gap-4 bg-gradient-to-br from-white via-blue-50/20 to-white">
          {/* Icon Container */}
          <div className={`w-14 h-14 rounded-lg bg-${mentor.color}-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <mentor.icon className={`text-${mentor.color}-600`} size={28} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {mentor.name}
            </h4>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors truncate mb-2">
              {mentor.specialty}
            </p>
            
            {/* Badge */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="text-yellow-500" size={14} fill="currentColor" />
              <span className="text-xs font-semibold text-gray-700">Expert</span>
            </div>

            {/* Button */}
            <ShimmerButton
              onClick={() => navigate('/browse-mentors')}
              background="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
              className="w-full text-white py-1.5 rounded-lg font-semibold text-xs"
            >
              View Profile
            </ShimmerButton>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Dotted Map Background */}
      <div className="absolute inset-0 opacity-35 pointer-events-none z-0">
        <DottedMap
          width={1200}
          height={800}
          mapSamples={5000}
          dotRadius={0.4}
          dotColor="#4f46e5"
          markerColor="#3b82f6"
          className="w-full h-full"
          style={{filter: 'blur(0.5px)'}}
        />
      </div>

      {/* Grid overlay for subtle texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
           style={{backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(99, 102, 241, .1) 25%, rgba(99, 102, 241, .1) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, .1) 75%, rgba(99, 102, 241, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(99, 102, 241, .1) 25%, rgba(99, 102, 241, .1) 26%, transparent 27%, transparent 74%, rgba(99, 102, 241, .1) 75%, rgba(99, 102, 241, .1) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px'}}></div>
      {/* Top Navigation Bar */}
      <div className="border-b border-indigo-100/50 bg-white/60 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search mentors, topics..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 ml-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Student'}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-screen overflow-hidden relative z-20">
        {/* Sidebar Navigation */}
        <div className="hidden lg:block w-64 border-r border-indigo-100/40 bg-white/40 backdrop-blur-md overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="font-bold text-lg text-gray-900">Mentorship</span>
            </div>

            <nav className="space-y-1">
              {[
                { icon: Home, label: 'Dashboard', active: true },
                { icon: Compass, label: 'Browse Mentors' },
                { icon: Send, label: 'My Requests' },
                { icon: Users, label: 'My Mentors' },
                { icon: Star, label: 'Favorites' },
                { icon: Settings, label: 'Settings' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-3 text-sm ${
                    item.active
                      ? 'bg-blue-100/60 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100/40'
                  }`}
                  onClick={() => {
                    if (item.label === 'Browse Mentors') navigate('/browse-mentors');
                    if (item.label === 'My Requests') navigate('/requests');
                    if (item.label === 'My Mentors') navigate('/my-mentors');
                    if (item.label === 'Settings') navigate('/settings');
                  }}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Friends Section */}
            <div className="mt-10 pt-6 border-t border-gray-200/50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Friends</h3>
              <div className="space-y-2">
                {[
                  { name: 'Alex Kim', points: '250 Points' },
                  { name: 'Jordan Lee', points: '180 Points' },
                ].map((friend, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/30 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {friend.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                      <p className="text-xs text-gray-500">{friend.points}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero Section with SpotlightCard */}
            <SpotlightCard className="mb-12 overflow-hidden border border-indigo-200/50 shadow-lg">
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  {/* Left Content */}
                  <div className="md:w-1/2">
                    <div className="inline-flex items-center gap-2 bg-blue-100/60 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
                      <Lightbulb size={14} />
                      100% Free
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                      <TextReveal text="Your Mentorship Journey" />
                    </h2>

                    <p className="text-gray-600 text-base mb-6">
                      Connect with industry experts. Get personalized guidance to accelerate your career growth.
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      {[
                        { icon: CheckCircle, text: '5+ experienced mentors' },
                        { icon: Clock, text: 'Flexible scheduling' },
                        { icon: Award, text: 'Industry recognized' },
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <feature.icon className="text-blue-600 flex-shrink-0" size={18} />
                          <span className="text-gray-700 text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <ShimmerButton
                      onClick={() => navigate('/browse-mentors')}
                      background="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
                      className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold shadow-lg text-sm"
                    >
                      <Compass size={18} />
                      Browse Mentors
                    </ShimmerButton>
                  </div>

                  {/* Right Illustration */}
                  <div className="md:w-1/2 flex justify-center">
                    <div className="relative w-56 h-56">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-br from-blue-100/80 to-indigo-100/60 rounded-2xl flex items-center justify-center shadow-lg">
                          <BookOpen className="text-blue-600" size={64} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {/* Stat 1: Requests Sent */}
              <BlurCard className="p-5 flex flex-col items-center justify-center backdrop-blur-xl bg-white/50 border border-indigo-100/50 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                  <Send className="text-blue-600" size={18} />
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1.5 leading-relaxed">Requests Sent</p>
                <p className="text-lg font-semibold text-gray-900 mb-2 leading-relaxed whitespace-nowrap">
                  <NumberTicker value={`${stats.requestsSent}`} />/<NumberTicker value={`${stats.requestsCompleted}`} />
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 leading-relaxed">
                  <TrendingUp size={11} />
                  In progress
                </p>
              </BlurCard>

              {/* Stat 2: Mentors Connected */}
              <BlurCard className="p-5 flex flex-col items-center justify-center backdrop-blur-xl bg-white/50 border border-indigo-100/50 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <Users className="text-green-600" size={18} />
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1.5 leading-relaxed">Connected Mentors</p>
                <p className="text-lg font-semibold text-gray-900 mb-2 leading-relaxed whitespace-nowrap">
                  <NumberTicker value={`${stats.mentorsConnected}`} />
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 leading-relaxed">
                  <Award size={11} />
                  Active
                </p>
              </BlurCard>

              {/* Stat 3: Points Earned */}
              <BlurCard className="p-5 flex flex-col items-center justify-center backdrop-blur-xl bg-white/50 border border-indigo-100/50 shadow-md">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center mb-3">
                  <Zap className="text-yellow-600" size={18} />
                </div>
                <p className="text-gray-600 text-xs font-medium mb-1.5 leading-relaxed">Points Earned</p>
                <p className="text-lg font-semibold text-gray-900 mb-2 leading-relaxed whitespace-nowrap">
                  <NumberTicker value={`${stats.pointsEarned}`} />/<NumberTicker value={`${stats.totalPoints}`} />
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 leading-relaxed">
                  <Flame size={11} />
                  Streak
                </p>
              </BlurCard>

              {/* Stat 4: Progress Circle */}
              <BlurCard className="p-5 flex flex-col items-center justify-center backdrop-blur-xl bg-white/50 border border-indigo-100/50 shadow-md">
                <div className="relative w-16 h-16 mb-3">
                  <svg className="transform -rotate-90 w-16 h-16">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2.5"
                      strokeDasharray={`${(progressPercent / 100) * 163} 163`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-semibold text-gray-900 whitespace-nowrap">
                      <NumberTicker value={`${Math.round(progressPercent)}`} />%
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-medium flex items-center gap-1.5 leading-relaxed">
                  <BarChart3 size={11} />
                  Progress
                </p>
              </BlurCard>
            </div>

            {/* Featured Mentors Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Featured Mentors</h3>
                  <p className="text-gray-600">Discover experienced professionals ready to guide your journey</p>
                </div>
                <button
                  onClick={() => navigate('/mentors')}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View All Mentors
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Horizontal Marquee Container */}
              <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50/40 via-white to-indigo-50/40 rounded-2xl py-4">
                <Marquee
                  pauseOnHover
                  repeat={4}
                  speed={30}
                  className="gap-4"
                >
                  {featuredMentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </Marquee>

                {/* Gradient Overlays for smooth edges - Left and Right */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blue-50/40 via-blue-50/20 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-indigo-50/40 via-indigo-50/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* My Requests Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={28} className="text-blue-600" />
                My Mentorship Requests
              </h3>

              <BlurCard className="p-8">
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                    <BookOpen className="text-blue-600" size={32} />
                  </div>
                  <p className="text-gray-600 text-lg mb-6">You have no mentorship requests yet</p>
                  <ShimmerButton
                    onClick={() => navigate('/mentors')}
                    background="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
                    className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-semibold"
                  >
                    <Compass size={18} />
                    Start by browsing mentors
                    <ArrowRight size={18} />
                  </ShimmerButton>
                </div>
              </BlurCard>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Events */}
        <div className="hidden xl:block w-72 border-l border-gray-200 bg-white p-6 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Upcoming Events
          </h3>

          <div className="space-y-4">
            {[
              { icon: Lightbulb, date: '22', day: 'Mon', title: 'Mentorship Q&A', count: '5 mentors', color: 'blue' },
              { icon: Zap, date: '23', day: 'Tue', title: 'Career Workshop', count: 'Live', color: 'yellow' },
              { icon: Users, date: '24', day: 'Wed', title: 'Networking Event', count: '20 attending', color: 'purple' },
            ].map((event, idx) => (
              <div key={idx} className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer hover:border-${event.color}-200 transition-colors`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg bg-${event.color}-50 flex items-center justify-center`}>
                    <event.icon className={`text-${event.color}-600`} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.count}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{event.date}</p>
                    <p className="text-xs text-gray-500">{event.day}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommended Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-600" />
              Daily Quest
            </h3>

            <div className="space-y-3">
              {[
                { icon: CheckCircle, title: 'Complete Profile', progress: '50%', color: 'blue' },
                { icon: Flame, title: 'Send First Request', progress: '100%', color: 'orange' },
              ].map((quest, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded bg-${quest.color}-50 flex items-center justify-center`}>
                        <quest.icon className={`text-${quest.color}-600`} size={16} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{quest.title}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-600">{quest.progress}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      style={{ width: quest.progress }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
