import express from 'express';
import { register, login, changePassword } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Creates a new user account
 * 
 * Required fields: fullName, email, password
 * Optional fields: rolePreference ('student' or 'mentor')
 * 
 * Response: { success, message, data: { id, fullName, email, role, token } }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Authenticates user and returns JWT token
 * 
 * Required fields: email, password
 * 
 * Response: { success, message, data: { id, fullName, email, role, token } }
 */
router.post('/login', login);

/**
 * POST /api/auth/change-password
 * Changes user password after verifying current password
 * 
 * Protected route (requires valid JWT token)
 * Required fields: currentPassword, newPassword
 * 
 * Authentication: Required (Bearer token in Authorization header)
 * Response: { success, message }
 */
router.post('/change-password', authMiddleware, changePassword);

export default router;
