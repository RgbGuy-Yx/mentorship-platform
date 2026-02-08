/**
 * Role-Based Authorization Middleware
 *
 * This middleware checks if the authenticated user's role is authorized
 * to access the protected route. Must be used AFTER authMiddleware.
 *
 * Usage:
 * router.post('/admin-only', authMiddleware, authorizeRoles('admin'), adminController);
 * router.get('/mentor-access', authMiddleware, authorizeRoles('mentor', 'admin'), mentorController);
 */

/**
 * Authorize specific roles to access a route
 * @param {...string} roles - One or more allowed roles (e.g., 'admin', 'mentor', 'student')
 * @returns {Function} Express middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Check if user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
        userRole: req.user.role,
      });
    }

    // User has required role, proceed to next middleware/route handler
    next();
  };
};

export default authorizeRoles;
