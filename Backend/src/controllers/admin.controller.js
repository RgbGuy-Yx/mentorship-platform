import User from '../models/User.js';

const getPendingMentors = async (req, res) => {
  try {
    const pendingMentors = await User.find({
      role: 'mentor',
      mentorStatus: 'pending',
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Pending mentors fetched successfully',
      data: pendingMentors,
      count: pendingMentors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending mentors',
      error: error.message,
    });
  }
};

const updateMentorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "approved" or "rejected"',
      });
    }

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor ID',
      });
    }

    const mentor = await User.findById(id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    if (mentor.role !== 'mentor') {
      return res.status(400).json({
        success: false,
        message: 'User is not a mentor',
      });
    }

    if (mentor.mentorStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Mentor is already ${mentor.mentorStatus}`,
      });
    }

    mentor.mentorStatus = status;
    await mentor.save();

    return res.status(200).json({
      success: true,
      message: `Mentor ${status} successfully`,
      data: {
        id: mentor._id,
        fullName: mentor.fullName,
        email: mentor.email,
        role: mentor.role,
        mentorStatus: mentor.mentorStatus,
        createdAt: mentor.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update mentor status',
      error: error.message,
    });
  }
};

const getApprovedMentors = async (req, res) => {
  try {
    const approvedMentors = await User.find({
      role: 'mentor',
      mentorStatus: 'approved',
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Approved mentors fetched successfully',
      data: approvedMentors,
      count: approvedMentors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved mentors',
      error: error.message,
    });
  }
};

const getRejectedMentors = async (req, res) => {
  try {
    const rejectedMentors = await User.find({
      role: 'mentor',
      mentorStatus: 'rejected',
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Rejected mentors fetched successfully',
      data: rejectedMentors,
      count: rejectedMentors.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rejected mentors',
      error: error.message,
    });
  }
};

export { getPendingMentors, updateMentorStatus, getApprovedMentors, getRejectedMentors };
