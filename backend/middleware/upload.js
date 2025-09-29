const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

// Ensure upload directory exists
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = config.UPLOAD_PATH;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'resume') {
      uploadPath = path.join(uploadPath, 'resumes');
    } else if (file.fieldname === 'profilePic') {
      uploadPath = path.join(uploadPath, 'profiles');
    } else if (file.fieldname === 'projectFiles') {
      uploadPath = path.join(uploadPath, 'projects');
    } else if (file.fieldname === 'submissionFiles') {
      uploadPath = path.join(uploadPath, 'submissions');
    } else {
      uploadPath = path.join(uploadPath, 'misc');
    }
    
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Define allowed file types for different fields
  const allowedTypes = {
    resume: ['.pdf', '.doc', '.docx'],
    profilePic: ['.jpg', '.jpeg', '.png', '.gif'],
    projectFiles: ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar', '.jpg', '.jpeg', '.png'],
    submissionFiles: ['.pdf', '.doc', '.docx', '.txt', '.zip', '.rar', '.jpg', '.jpeg', '.png', '.mp4', '.avi']
  };
  
  const extension = path.extname(file.originalname).toLowerCase();
  const fieldAllowedTypes = allowedTypes[file.fieldname] || allowedTypes.projectFiles;
  
  if (fieldAllowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldAllowedTypes.join(', ')}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE,
    files: 10 // Maximum 10 files per request
  },
  fileFilter: fileFilter
});

// Middleware for different upload types
const uploadMiddleware = {
  // Single file uploads
  resume: upload.single('resume'),
  profilePic: upload.single('profilePic'),
  
  // Multiple file uploads
  projectFiles: upload.array('projectFiles', 5),
  submissionFiles: upload.array('submissionFiles', 10),
  
  // Mixed uploads
  mixed: upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profilePic', maxCount: 1 },
    { name: 'projectFiles', maxCount: 5 },
    { name: 'submissionFiles', maxCount: 10 }
  ])
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `File too large. Maximum size is ${config.MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Utility function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Utility function to get file info
const getFileInfo = (file) => {
  return {
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype
  };
};

module.exports = {
  upload,
  uploadMiddleware,
  handleUploadError,
  deleteFile,
  getFileInfo
};
