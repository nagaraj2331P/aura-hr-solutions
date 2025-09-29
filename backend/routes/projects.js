const express = require('express');
const { authenticate, authorize, checkPermission } = require('../middleware/auth');
const Project = require('../models/Project');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (public/filtered)
// @access  Public/Private
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query;
    
    const query = { status, isActive: true };
    
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

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('assignedTo.student', 'name email')
      .populate('assignedTo.assignedBy', 'name');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
