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

router.get(
  '/pending-mentors',
  authMiddleware,
  authorizeRoles('admin'),
  getPendingMentors
);

router.get(
  '/approved-mentors',
  authMiddleware,
  authorizeRoles('admin'),
  getApprovedMentors
);

router.get(
  '/rejected-mentors',
  authMiddleware,
  authorizeRoles('admin'),
  getRejectedMentors
);

router.patch(
  '/mentor/:id',
  authMiddleware,
  authorizeRoles('admin'),
  updateMentorStatus
);

export default router;
