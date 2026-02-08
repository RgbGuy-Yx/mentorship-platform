import express from 'express';
import { getMentors, updateProfile, getUserById } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/mentors', authMiddleware, getMentors);

router.get('/:id', authMiddleware, getUserById);

router.put('/profile', authMiddleware, updateProfile);

export default router;
