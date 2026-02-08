/**
 * Mentorship Request Controller
 *
 * Handles all business logic for mentorship requests:
 * - Creating requests from students
 * - Retrieving requests for mentors
 * - Updating request status (accept/reject)
 */

import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';

/**
 * Create a new mentorship request
 *
 * POST /requests
 * - Only students can create requests
 * - Creates a pending request to a specific mentor
 *
 * Request body: { mentorId }
 * Returns: { success: true, data: newRequest }
 */
const createRequest = async (req, res) => {
  try {
    // Extract mentorId from request body
    const { mentorId } = req.body;

    // Validate mentorId is provided
    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required',
      });
    }

    // Verify the mentor exists and has 'mentor' or 'admin' role
    const mentor = await User.findById(mentorId);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    if (mentor.role !== 'mentor' && mentor.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Selected user is not a mentor',
      });
    }

    // Verify the mentor is APPROVED before allowing request
    // Students cannot request pending or rejected mentors
    if (mentor.mentorStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This mentor is not available for mentorship requests. They may be pending approval or have been rejected.',
      });
    }

    // Prevent student from creating duplicate request to same mentor
    // Check for pending or accepted requests
    const existingRequest = await MentorshipRequest.findOne({
      student: req.user.userId,
      mentor: mentorId,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingRequest) {
      const message = existingRequest.status === 'accepted' 
        ? 'You are already mentored by this mentor'
        : 'You already have a pending request with this mentor';
      
      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Create the mentorship request
    const newRequest = await MentorshipRequest.create({
      student: req.user.userId, // req.user.userId set by authMiddleware
      mentor: mentorId,
      status: 'pending',
    });

    // Populate references for response
    const populatedRequest = await newRequest.populate([
      { path: 'student', select: 'fullName email bio dateOfBirth location currentRole skills goals' },
      { path: 'mentor', select: 'fullName email' },
    ]);

    return res.status(201).json({
      success: true,
      message: 'Mentorship request created successfully',
      data: populatedRequest,
    });
  } catch (error) {
    console.error('Create request error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to create mentorship request',
      error: error.message,
    });
  }
};

/**
 * Get all mentorship requests for logged-in mentor
 *
 * GET /requests
 * - Only mentors can view their requests
 * - Returns requests where the logged-in user is the mentor
 *
 * Query params (optional): ?status=pending
 * Returns: { success: true, data: [requests] }
 */
const getRequests = async (req, res) => {
  try {
    // Extract optional status filter from query params
    const { status } = req.query;

    // Build query object
    const query = {
      mentor: req.user.userId, // Only get requests assigned to this mentor
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Fetch requests with populated user details
    const requests = await MentorshipRequest.find(query)
      .populate('student', 'fullName email bio dateOfBirth location currentRole skills goals')
      .populate('mentor', 'fullName email')
      .sort({ createdAt: -1 }); // Sort newest first

    return res.status(200).json({
      success: true,
      message: 'Mentorship requests retrieved successfully',
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Get requests error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentorship requests',
      error: error.message,
    });
  }
};

/**
 * Update mentorship request status (accept or reject)
 *
 * PATCH /requests/:id
 * - Only the assigned mentor can update the request
 * - Updates status to 'accepted' or 'rejected'
 *
 * Params: id (request ID)
 * Body: { status: 'accepted' | 'rejected' }
 * Returns: { success: true, data: updatedRequest }
 */
const updateRequest = async (req, res) => {
  try {
    // Extract request ID and new status
    const { id } = req.params;
    const { status } = req.body;

    // Validate status is provided and has valid value
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "accepted" or "rejected"',
      });
    }

    // Find the request
    const request = await MentorshipRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found',
      });
    }

    // Verify the logged-in user is the assigned mentor
    if (request.mentor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request',
      });
    }

    // Prevent updating already resolved requests
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${request.status} request`,
      });
    }

    // Update the request status
    request.status = status;
    const updatedRequest = await request.save();

    // Populate references for response
    const populatedRequest = await updatedRequest.populate([
      { path: 'student', select: 'fullName email' },
      { path: 'mentor', select: 'fullName email' },
    ]);

    return res.status(200).json({
      success: true,
      message: `Mentorship request ${status} successfully`,
      data: populatedRequest,
    });
  } catch (error) {
    console.error('Update request error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to update mentorship request',
      error: error.message,
    });
  }
};

/**
 * Get all mentorship requests sent by logged-in student
 *
 * GET /requests/my-requests
 * - Only students can view their own requests
 * - Returns all requests where the logged-in user is the student
 * - Includes mentor details and current status
 *
 * Query params (optional): ?status=pending
 * Returns: { success: true, data: [requests] }
 */
const getStudentRequests = async (req, res) => {
  try {
    // Extract optional status filter from query params
    const { status } = req.query;

    // Build query object
    const query = {
      student: req.user.userId, // Only get requests created by this student
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Fetch requests with populated user details
    const requests = await MentorshipRequest.find(query)
      .populate('student', 'fullName email')
      .populate('mentor', 'fullName email role')
      .sort({ createdAt: -1 }); // Sort newest first

    return res.status(200).json({
      success: true,
      message: 'Student mentorship requests retrieved successfully',
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Get student requests error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your mentorship requests',
      error: error.message,
    });
  }
};

export { createRequest, getRequests, updateRequest, getStudentRequests };
