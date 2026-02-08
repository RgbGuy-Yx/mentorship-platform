// Import required dependencies
import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware - Verifies JWT tokens
 *
 * This middleware:
 * 1. Extracts the JWT token from the Authorization header
 * 2. Verifies the token using the JWT_SECRET
 * 3. Attaches the decoded user data to req.user
 * 4. Calls next() to continue to the protected route
 *
 * Usage: app.use('/protected-route', authMiddleware)
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Step 1: Extract the Authorization header
    // The header format is: "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    // Step 2: Check if Authorization header exists
    // If no header, the user hasn't sent a token
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      });
    }

    // Step 3: Extract the token from the header
    // Split by space: ["Bearer", "<token>"]
    // We take the second part (index 1)
    const parts = authHeader.split(' ');

    // Step 4: Verify the header format is correct
    // The Authorization header MUST start with "Bearer"
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format',
      });
    }

    // Step 5: Extract the actual token
    const token = parts[1];

    // Step 6: Verify and decode the JWT token
    // jwt.verify() checks if:
    // - The token signature is valid (wasn't tampered with)
    // - The token hasn't expired
    // If valid, it returns the decoded payload (userId, role, etc.)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 7: Attach the decoded user data to the request object
    // This makes user information available to the next middleware/route handler
    // Now you can access req.user.userId and req.user.role in protected routes
    req.user = decoded;

    // Step 8: Continue to the next middleware or route handler
    // Without calling next(), the request won't proceed
    next();
  } catch (error) {
    // Step 9: Handle JWT errors gracefully
    // Different errors have different meanings:
    // - TokenExpiredError: Token has expired
    // - JsonWebTokenError: Token is invalid/tampered with
    // - Other errors: Unexpected issues

    // Check if error is due to token expiration
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    // Check if error is due to invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    // Any other unexpected error
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

export default authMiddleware;