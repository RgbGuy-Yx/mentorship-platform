import User from '../models/User.js';

/**
 * GET PENDING MENTORS CONTROLLER
 * 
 * Fetches all mentors with pending approval status
 * - Filters by role === "mentor" AND mentorStatus === "pending"
 * - Excludes password field from response
 * - Protected route (requires admin authentication)
 * 
 * Response: Array of pending mentor objects with public data only
 */
const getPendingMentors = async (req, res) => {
  try {
    // Query for all pending mentors
    // .select('-password') excludes the password field from the response
    const pendingMentors = await User.find({
      role: 'mentor',
      mentorStatus: 'pending',
    }).select('-password');

    // Return success response with pending mentors data
    res.status(200).json({
      success: true,
      message: 'Pending mentors fetched successfully',
      data: pendingMentors,
      count: pendingMentors.length,
    });
  } catch (error) {
    console.error('❌ Error fetching pending mentors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending mentors',
      error: error.message,
    });
  }
};

/**
 * UPDATE MENTOR STATUS CONTROLLER
 * 
 * Approves or rejects a mentor's account
 * - Updates mentorStatus from "pending" to "approved" or "rejected"
 * - Protected route (requires admin authentication)
 * - Only admins can approve or reject mentors
 * 
 * Route params: id (mentor user ID)
 * Request body: { status: "approved" | "rejected" }
 * Response: { success, message, data: updatedMentor }
 */
const updateMentorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    // Only allow "approved" or "rejected" statuses
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "approved" or "rejected"',
      });
    }

    // Validate mentor ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor ID',
      });
    }

    // Find the mentor user
    const mentor = await User.findById(id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found',
      });
    }

    // Verify the user is actually a mentor
    if (mentor.role !== 'mentor') {
      return res.status(400).json({
        success: false,
        message: 'User is not a mentor',
      });
    }

    // Verify the mentor is in pending status
    if (mentor.mentorStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Mentor is already ${mentor.mentorStatus}`,
      });
    }

    // Update mentor status
    mentor.mentorStatus = status;
    await mentor.save();

    // Return success response with updated mentor data (excluding password)
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
    console.error('❌ Error updating mentor status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update mentor status',
      error: error.message,
    });
  }
};

/**
 * GET ALL MENTORS (APPROVED ONLY) CONTROLLER
 * 
 * Fetches all approved mentors
 * - Filters by role === "mentor" AND mentorStatus === "approved"
 * - Excludes password field from response
 * - Protected route (requires admin authentication)
 * 
 * Response: Array of approved mentor objects
 */
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
    console.error('❌ Error fetching approved mentors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch approved mentors',
      error: error.message,
    });
  }
};

/**
 * GET ALL REJECTED MENTORS CONTROLLER
 * 
 * Fetches all rejected mentors
 * - Filters by role === "mentor" AND mentorStatus === "rejected"
 * - Excludes password field from response
 * - Protected route (requires admin authentication)
 * 
 * Response: Array of rejected mentor objects
 */
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
    console.error('❌ Error fetching rejected mentors:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rejected mentors',
      error: error.message,
    });
  }
};

export { getPendingMentors, updateMentorStatus, getApprovedMentors, getRejectedMentors };
