import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const getDashboardPath = () => {
    if (!user) return '/';
    return user.role === 'mentor' ? '/mentor/dashboard' :
           user.role === 'admin' ? '/admin' :
           '/dashboard';
  };

  const handleGoToDashboard = () => {
    navigate(getDashboardPath());
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="text-center max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </motion.div>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 text-lg mb-8">
          You don't have permission to access this page.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <motion.button
            onClick={handleGoToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go to Dashboard
          </motion.button>
          
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
