"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { AuthContext } from "../context/AuthContext"

const LandingNavbar = ({ heroRef, featuresRef, howItWorksRef, mentorsRef }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const dashboardPath = 
      user?.role === 'mentor' ? '/mentor/dashboard' :
      user?.role === 'admin' ? '/admin' :
      '/dashboard'
    
    navigate(dashboardPath)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const navItems = [
    { label: "Features", ref: featuresRef },
    { label: "How It Works", ref: howItWorksRef },
    { label: "Top Mentors", ref: mentorsRef },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full py-6 px-4">
      <motion.div
        className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg w-full max-w-5xl border border-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white font-bold text-lg">M</span>
            </motion.div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">MentorHub</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={() => scrollToSection(item.ref)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                color: "#2563eb"
              }}
              className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium rounded-lg hover:bg-blue-50"
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <motion.div
          className="hidden md:flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {isAuthenticated ? (
            <>
              <motion.button
                onClick={handleDashboardClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </motion.button>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-lg transition-shadow font-medium"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-lg transition-shadow font-medium"
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-gray-900" />
          ) : (
            <Menu className="h-6 w-6 text-gray-900" />
          )}
        </motion.button>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 pt-32 px-6 md:hidden overflow-y-auto"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>

            <div className="flex flex-col space-y-4">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.ref)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-base text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-8 flex flex-col gap-3 border-t border-gray-200"
              >
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleDashboardClick}
                      className="w-full px-5 py-3 text-base text-gray-700 border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-base text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-lg transition-shadow font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="w-full">
                      <button
                        onClick={toggleMenu}
                        className="w-full px-5 py-3 text-base text-gray-700 border border-gray-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors font-medium"
                      >
                        Login
                      </button>
                    </Link>
                    <Link to="/register" className="w-full">
                      <button
                        onClick={toggleMenu}
                        className="w-full px-5 py-3 text-base text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:shadow-lg transition-shadow font-medium"
                      >
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { LandingNavbar }
