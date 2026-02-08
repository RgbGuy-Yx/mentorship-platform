
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

router.post(
  '/',
  authMiddleware,
  authorizeRoles('student'),
  createRequest
);

router.get(
  '/my-requests',
  authMiddleware,
  authorizeRoles('student'),
  getStudentRequests
);

router.get(
  '/',
  authMiddleware,
  authorizeRoles('mentor'),
  getRequests
);

router.patch(
  '/:id',
  authMiddleware,
  authorizeRoles('mentor'),
  updateRequest
);

export default router;
