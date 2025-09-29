const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Submission = require('../models/Submission');

const router = express.Router();

// @route   GET /api/submissions
// @desc    Get submissions (filtered by user type)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    
    // Students can only see their own submissions
    if (req.userType === 'student') {
      query.student = req.user._id;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    const submissions = await Submission.find(query)
      .populate('project', 'title deadline')
      .populate('student', 'name email')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Submission.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
