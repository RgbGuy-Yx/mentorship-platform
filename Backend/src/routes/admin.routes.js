import express from 'express';
import {
  getPendingMentors,
  updateMentorStatus,
  getApprovedMentors,
  getRejectedMentors,
} from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorizeRoles from '../middleware/role.middleware.js';

const router = express.Router();

/**
 * ADMIN ROUTES - All protected with auth and admin role verification
 * 
 * Middleware order:
 * 1. authMiddleware - Verifies JWT token and attaches user to request
 * 2. authorizeRoles('admin') - Ensures only admins can access
 */

/**
 * GET /api/admin/pending-mentors
 * 
 * Fetch all mentors with "pending" approval status
 * - Admin-only route
 * - Returns array of pending mentor objects with public data (no password)
 * 
 * Response: { success, message, data: [mentors], count }
 */
router.get(
  '/pending-mentors',
  authMiddleware,
  authorizeRoles('admin'),
  getPendingMentors
);

/**
 * GET /api/admin/approved-mentors
 * 
 * Fetch all mentors with "approved" status
 * - Admin-only route
 * - Returns array of approved mentor objects
 * 
 * Response: { success, message, data: [mentors], count }
 */
router.get(
  '/approved-mentors',
  authMiddleware,
  authorizeRoles('admin'),
  getApprovedMentors
);

/**
 * GET /api/admin/rejected-mentors
 * 
 * Fetch all mentors with "rejected" status
 * - Admin-only route
 * - Returns array of rejected mentor objects
 * 
 * Response: { success, message, data: [mentors], count }
 */
router.get(
  '/rejected-mentors',
  authMiddleware,
  authorizeRoles('admin'),
  getRejectedMentors
);

/**
 * PATCH /api/admin/mentor/:id
 * 
 * Update mentor approval status (approve or reject)
 * - Admin-only route
 * - Route param: id (mentor's user ID)
 * - Request body: { status: "approved" | "rejected" }
 * 
 * Returns: Updated mentor object with new mentorStatus
 * Errors:
 * - 404: Mentor not found
 * - 400: Invalid status, user is not a mentor, or mentor not pending
 * - 401: User not authenticated
 * - 403: User is not an admin
 */
router.patch(
  '/mentor/:id',
  authMiddleware,
  authorizeRoles('admin'),
  updateMentorStatus
);

export default router;
