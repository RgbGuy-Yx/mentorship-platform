import User from '../models/User.js';

const getMentors = async (req, res) => {
  try {
    const mentors = await User.find({
      role: 'mentor',
      mentorStatus: 'approved',
    }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Mentors fetched successfully',
      data: mentors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, dateOfBirth, location, currentRole, skills, goals } = req.body;
    const userId = req.user.userId; // From auth middleware

    const updateData = {};

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

    if (bio !== undefined) updateData.bio = bio.trim();
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (location !== undefined) updateData.location = location.trim();
    if (currentRole !== undefined) updateData.currentRole = currentRole.trim();
    if (skills !== undefined) updateData.skills = skills.trim();
    if (goals !== undefined) updateData.goals = goals.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

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
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

export { getMentors, updateProfile, getUserById };
