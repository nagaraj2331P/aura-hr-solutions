const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Timesheet = require('../models/Timesheet');

const router = express.Router();

// @route   GET /api/timesheets
// @desc    Get timesheets (filtered by user type)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    let query = {};
    
    // Students can only see their own timesheets
    if (req.userType === 'student') {
      query.student = req.user._id;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const timesheets = await Timesheet.find(query)
      .populate('student', 'name email')
      .populate('project', 'title hourlyRate')
      .populate('approvedBy', 'name')
      .sort({ loginTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Timesheet.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        timesheets,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get timesheets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
