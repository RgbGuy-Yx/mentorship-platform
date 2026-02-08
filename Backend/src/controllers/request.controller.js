
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';

const createRequest = async (req, res) => {
  try {
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({
        success: false,
        message: 'Mentor ID is required',
      });
    }

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

    if (mentor.mentorStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This mentor is not available for mentorship requests. They may be pending approval or have been rejected.',
      });
    }

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

    const newRequest = await MentorshipRequest.create({
      student: req.user.userId, // req.user.userId set by authMiddleware
      mentor: mentorId,
      status: 'pending',
    });

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

const getRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {
      mentor: req.user.userId, // Only get requests assigned to this mentor
    };

    if (status) {
      query.status = status;
    }

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
  } catch (error) {    console.error('Get student requests error:', error.message);    console.error('Get requests error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve mentorship requests',
      error: error.message,
    });
  }
};

const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

    const request = await MentorshipRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found',
      });
    }

    if (request.mentor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${request.status} request`,
      });
    }

    request.status = status;
    const updatedRequest = await request.save();

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

const getStudentRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const query = {
      student: req.user.userId, // Only get requests created by this student
    };

    if (status) {
      query.status = status;
    }

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

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your mentorship requests',
      error: error.message,
    });
  }
};

export { createRequest, getRequests, updateRequest, getStudentRequests };
