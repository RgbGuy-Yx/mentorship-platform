/**
 * Mentorship Request Routes
 *
 * These routes handle all mentorship request operations:
 * - Students create requests to find mentors
 * - Mentors view requests they've received
 * - Mentors accept or reject requests
 *
 * All routes are protected by authentication middleware
 * and role-based authorization middleware
 */

import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import authorizeRoles from '../middleware/role.middleware.js';
import {
  createRequest,
  getRequests,
  updateRequest,
  getStudentRequests,
} from '../controllers/request.controller.js';

const router = express.Router();

/**
 * POST /
 * Student creates a new mentorship request
 *
 * Protection:
 * - authMiddleware: Ensures user is logged in
 * - authorizeRoles('student'): Only students can create requests
 *
 * Body: { mentorId, message, subject, ... }
 * Response: { success: true, data: createdRequest }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('student'),
  createRequest
);

/**
 * GET /my-requests
 * Student views all mentorship requests they've sent
 *
 * Protection:
 * - authMiddleware: Ensures user is logged in
 * - authorizeRoles('student'): Only students can view their requests
 *
 * Query params: ?status=pending (optional filter)
 * Response: { success: true, data: [requests] }
 */
router.get(
  '/my-requests',
  authMiddleware,
  authorizeRoles('student'),
  getStudentRequests
);

/**
 * GET /
 * Mentor views all mentorship requests they've received
 *
 * Protection:
 * - authMiddleware: Ensures user is logged in
 * - authorizeRoles('mentor'): Only mentors can view requests
 *
 * Query params: ?status=pending (optional filter)
 * Response: { success: true, data: [requests] }
 */
router.get(
  '/',
  authMiddleware,
  authorizeRoles('mentor'),
  getRequests
);

/**
 * PATCH /:id
 * Mentor accepts or rejects a mentorship request
 *
 * Protection:
 * - authMiddleware: Ensures user is logged in
 * - authorizeRoles('mentor'): Only mentors can update requests
 *
 * Params: id (request ID to update)
 * Body: { status: 'accepted' | 'rejected', response: 'message' }
 * Response: { success: true, data: updatedRequest }
 */
router.patch(
  '/:id',
  authMiddleware,
  authorizeRoles('mentor'),
  updateRequest
);

export default router;
