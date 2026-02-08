import User from '../models/User.js';

/**
 * GET MENTORS CONTROLLER
 * 
 * Fetches all mentors (temporary: no approval filter)
 * - Filters by role === "mentor"
 * - Excludes password field from response
 * - Protected route (requires authentication)
 * 
 * Response: Array of mentor objects with public data only
 */
const getMentors = async (req, res) => {
  try {
    // Query for all APPROVED mentors only
    // .select('-password') excludes the password field from the response
    // Only approved mentors should be visible to students
    const mentors = await User.find({
      role: 'mentor',
      mentorStatus: 'approved',
    }).select('-password');

    // Return success response with mentor data
    res.status(200).json({
      success: true,
      message: 'Mentors fetched successfully',
      data: mentors,
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message,
    });
  }
};

/**
 * UPDATE PROFILE CONTROLLER
 * 
 * Updates user profile information
 * - Updates fullName
 * - Protected route (requires authentication)
 * - User can only update their own profile
 * 
 * Request body: { fullName }
 * Response: { success, message, data: updatedUser }
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, dateOfBirth, location, currentRole, skills, goals } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Build update object with all fields that are provided
    const updateData = {};

    // Handle fullName if provided (for profile tab)
    if (fullName) {
      if (!fullName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Full name is required',
        });
      }

      if (fullName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Full name must be at least 2 characters',
        });
      }

      if (fullName.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Full name must be less than 50 characters',
        });
      }

      updateData.fullName = fullName.trim();
    }

    // Handle profile completion fields (for complete-profile tab)
    if (bio !== undefined) updateData.bio = bio.trim();
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (location !== undefined) updateData.location = location.trim();
    if (currentRole !== undefined) updateData.currentRole = currentRole.trim();
    if (skills !== undefined) updateData.skills = skills.trim();
    if (goals !== undefined) updateData.goals = goals.trim();

    // If no fields provided, return error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * GET USER BY ID CONTROLLER
 * 
 * Fetches a user profile by ID
 * - Supports fetching mentor profiles
 * - Excludes password from response
 * - Protected route (requires authentication)
 * 
 * Route param: id (User ID)
 * Response: { success, message, data: user }
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    // Fetch user by ID, excluding password
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

export { getMentors, updateProfile, getUserById };
