const express = require('express');
const { authenticate, authorize, checkPermission } = require('../middleware/auth');
const Student = require('../models/Student');
const Project = require('../models/Project');
const Submission = require('../models/Submission');
const Timesheet = require('../models/Timesheet');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Get counts
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalProjects = await Project.countDocuments({ isActive: true });
    const pendingSubmissions = await Submission.countDocuments({ status: 'submitted' });
    const pendingTimesheets = await Timesheet.countDocuments({ status: 'completed' });
    
    // Get recent activities
    const recentSubmissions = await Submission.find({ status: 'submitted' })
      .populate('student', 'name email')
      .populate('project', 'title')
      .sort({ submittedAt: -1 })
      .limit(5);
    
    const recentProjects = await Project.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get project status distribution
    const projectStats = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalProjects,
          pendingSubmissions,
          pendingTimesheets
        },
        recentSubmissions,
        recentProjects,
        projectStats
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/admin/students
// @desc    Get all students
// @access  Private (Admin)
router.get('/students', authenticate, authorize('admin'), checkPermission('manage_students'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, skills, expertise } = req.query;
    
    const query = { isActive: true };
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }
    
    // Filter by expertise
    if (expertise) {
      query.expertise = expertise;
    }
    
    const students = await Student.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Student.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        students,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
