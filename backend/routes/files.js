const express = require('express');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const { uploadMiddleware, handleUploadError, getFileInfo } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/files/upload/resume
// @desc    Upload resume file
// @access  Private (Student)
router.post('/upload/resume', authenticate, uploadMiddleware.resume, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const fileInfo = getFileInfo(req.file);
    
    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: fileInfo
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/files/upload/profile-pic
// @desc    Upload profile picture
// @access  Private (Student)
router.post('/upload/profile-pic', authenticate, uploadMiddleware.profilePic, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const fileInfo = getFileInfo(req.file);
    
    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: fileInfo
    });
  } catch (error) {
    console.error('Profile pic upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/files/download/:filename
// @desc    Download file
// @access  Private
router.get('/download/:filename', authenticate, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
