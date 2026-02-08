import express from 'express';
import { getMentors, updateProfile, getUserById } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/users/mentors
 * 
 * Fetches all approved mentors
 * - Protected route (requires valid JWT token)
 * - Returns list of mentor profiles without password
 * 
 * Authentication: Required (Bearer token in Authorization header)
 * Response: { success, message, data: [mentors] }
 */
router.get('/mentors', authMiddleware, getMentors);

/**
 * GET /api/users/:id
 * 
 * Fetches a user profile by ID (typically for viewing mentor profiles)
 * - Protected route (requires valid JWT token)
 * - Excludes password from response
 * 
 * Authentication: Required (Bearer token in Authorization header)
 * Params: id (User ID)
 * Response: { success, message, data: user }
 */
router.get('/:id', authMiddleware, getUserById);

/**
 * PUT /api/users/profile
 * 
 * Updates user profile information
 * - Protected route (requires valid JWT token)
 * - Users can only update their own profile
 * - Updates fullName field
 * 
 * Authentication: Required (Bearer token in Authorization header)
 * Request body: { fullName }
 * Response: { success, message, data: updatedUser }
 */
router.put('/profile', authMiddleware, updateProfile);

export default router;
