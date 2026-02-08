// Import required dependencies
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * SIGNUP (REGISTER) CONTROLLER
 * Creates a new user account with validated credentials
 * 
 * Required fields: fullName, email, password
 * Optional fields: rolePreference
 */
const register = async (req, res) => {
  try {
    // Extract and normalize user input
    const { fullName, email, password, rolePreference } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email, and password',
      });
    }

    // Normalize email: lowercase and trim
    const normalizedEmail = email.toLowerCase().trim();

    // Validate email format using regex
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Determine role and mentorStatus
    let role = 'student';
    let mentorStatus = 'pending';

    if (rolePreference === 'mentor') {
      role = 'mentor';
      mentorStatus = 'pending';
    } else if (rolePreference === 'admin') {
      role = 'admin';
      mentorStatus = 'approved'; // Admins don't need approval
    }

    // Create new user - DO NOT hash password here, let pre-save hook handle it
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password, // Plain password - pre-save hook will hash it
      role,
      mentorStatus,
    });

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const token = jwt.sign(
      {
        userId: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    // Return success response (no password included)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        token,
      },
    });
  } catch (error) {
    console.error('❌ Registration error:', error.message);

    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    // Return generic server error
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};


/**
 * LOGIN CONTROLLER
 * Authenticates user credentials and returns JWT token
 * 
 * Required fields: email, password
 */
const login = async (req, res) => {
  try {
    // Extract credentials
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email and include password field
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    // If user not found, return generic error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Compare passwords using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, return generic error
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Verify JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );

    // Return success response (no password included)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        mentorStatus: user.mentorStatus,
        token,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

/**
 * CHANGE PASSWORD CONTROLLER
 * Allows authenticated users to change their password
 * 
 * Required fields: currentPassword, newPassword
 * - Verifies current password before allowing change
 * - Protected route (requires authentication)
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // From auth middleware

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password',
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters',
      });
    }

    // Prevent using same password as current
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    // Find user by ID and include password field
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordMatch = await user.matchPassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    user.markModified('password'); // Explicitly mark password as modified for Mongoose
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('❌ Change password error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

export { register, login, changePassword };
