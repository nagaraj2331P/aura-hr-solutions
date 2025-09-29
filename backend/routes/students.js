const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Student = require('../models/Student');
const Project = require('../models/Project');
const Submission = require('../models/Submission');
const Timesheet = require('../models/Timesheet');

const router = express.Router();

// @route   GET /api/students/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', authenticate, authorize('student'), async (req, res) => {
  try {
    const studentId = req.user._id;
    
    // Get student's projects
    const projects = await Project.find({
      'assignedTo.student': studentId,
      isActive: true
    }).populate('createdBy', 'name');
    
    // Get recent submissions
    const submissions = await Submission.find({ student: studentId })
      .populate('project', 'title deadline')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent timesheets
    const timesheets = await Timesheet.find({ student: studentId })
      .populate('project', 'title')
      .sort({ loginTime: -1 })
      .limit(5);
    
    // Calculate stats
    const totalHours = await Timesheet.aggregate([
      { $match: { student: studentId, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$totalHours' } } }
    ]);
    
    const totalEarnings = await Timesheet.aggregate([
      { $match: { student: studentId, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$earnings' } } }
    ]);
    
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const activeProjects = projects.filter(p => ['assigned', 'in_progress'].includes(p.status)).length;
    
    res.json({
      success: true,
      data: {
        stats: {
          totalProjects: projects.length,
          activeProjects,
          completedProjects,
          totalHours: totalHours[0]?.total || 0,
          totalEarnings: totalEarnings[0]?.total || 0
        },
        projects: projects.slice(0, 5),
        submissions,
        timesheets
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/students/projects
// @desc    Get available projects for student
// @access  Private (Student)
router.get('/projects', authenticate, authorize('student'), async (req, res) => {
  try {
    const { page = 1, limit = 10, skills, difficulty, category } = req.query;
    
    const query = {
      status: 'published',
      isActive: true
    };
    
    // Filter by skills if provided
    if (skills) {
      const skillsArray = skills.split(',');
      query.skillsRequired = { $in: skillsArray };
    }
    
    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    const projects = await Project.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
