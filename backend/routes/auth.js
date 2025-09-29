const express = require('express');
const Joi = require('joi');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Timesheet = require('../models/Timesheet');
const { generateTokens } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const studentRegisterSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).required(),
  skills: Joi.array().items(Joi.string()),
  expertise: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
  bio: Joi.string().max(500),
  education: Joi.object({
    degree: Joi.string(),
    institution: Joi.string(),
    year: Joi.number()
  })
});

const adminRegisterSchema = Joi.object({
  name: Joi.string().required().max(100),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'super_admin').default('admin'),
  department: Joi.string().default('HR')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  userType: Joi.string().valid('student', 'admin').required()
});

// @route   POST /api/auth/register/student
// @desc    Register a new student
// @access  Public
router.post('/register/student', async (req, res) => {
  try {
    const { error, value } = studentRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: value.email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Create new student
    const student = new Student(value);
    await student.save();

    // Generate tokens
    const tokens = generateTokens(student, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: tokens
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/register/admin
// @desc    Register a new admin (restricted)
// @access  Private (Super Admin only)
router.post('/register/admin', authenticate, async (req, res) => {
  try {
    // Check if user is super admin
    if (req.userType !== 'admin' || req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can create new admin accounts'
      });
    }

    const { error, value } = adminRegisterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: value.email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const admin = new Admin({
      ...value,
      createdBy: req.user._id
    });
    await admin.save();

    // Generate tokens
    const tokens = generateTokens(admin, 'admin');

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: tokens
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (student or admin)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { email, password, userType } = value;

    // Find user based on userType
    let user;
    if (userType === 'student') {
      user = await Student.findOne({ email }).select('+password');
    } else if (userType === 'admin') {
      user = await Admin.findOne({ email }).select('+password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Create timesheet entry for students
    if (userType === 'student') {
      // Check if there's already an active timesheet
      const activeTimesheet = await Timesheet.findOne({
        student: user._id,
        status: 'active',
        logoutTime: null
      });

      if (!activeTimesheet) {
        const timesheet = new Timesheet({
          student: user._id,
          loginTime: new Date(),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
        await timesheet.save();
      }
    }

    // Generate tokens
    const tokens = generateTokens(user, userType);

    res.json({
      success: true,
      message: 'Login successful',
      data: tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
  try {
    // For students, update the active timesheet
    if (req.userType === 'student') {
      const activeTimesheet = await Timesheet.findOne({
        student: req.user._id,
        status: 'active',
        logoutTime: null
      });

      if (activeTimesheet) {
        await activeTimesheet.logout();
      }
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    let userData = req.user.toObject();
    
    // Add additional data for students
    if (req.userType === 'student') {
      const completionRate = await req.user.getCompletionRate();
      userData.completionRate = completionRate;
      
      // Get active timesheet
      const activeTimesheet = await Timesheet.findOne({
        student: req.user._id,
        status: 'active',
        logoutTime: null
      });
      userData.activeTimesheet = activeTimesheet;
    }

    res.json({
      success: true,
      data: {
        user: userData,
        userType: req.userType
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, async (req, res) => {
  try {
    const allowedFields = req.userType === 'student' 
      ? ['name', 'phone', 'skills', 'expertise', 'bio', 'education', 'experience']
      : ['name', 'department'];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const Model = req.userType === 'student' ? Student : Admin;
    const updatedUser = await Model.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const Model = req.userType === 'student' ? Student : Admin;
    const user = await Model.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
