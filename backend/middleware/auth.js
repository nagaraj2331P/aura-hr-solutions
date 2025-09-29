const { verifyToken, extractToken } = require('../utils/jwt');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }
    
    const decoded = verifyToken(token);
    
    // Find user based on userType
    let user;
    if (decoded.userType === 'student') {
      user = await Student.findById(decoded.id).select('-password');
    } else if (decoded.userType === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    req.user = user;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Middleware to authorize specific user types
const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!req.userType || !userTypes.includes(req.userType)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Middleware to check admin permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`
      });
    }
    
    next();
  };
};

// Middleware to check if user owns the resource
const checkOwnership = (resourceField = 'student') => {
  return (req, res, next) => {
    const resourceId = req.params.id || req.body[resourceField];
    
    if (req.userType === 'admin') {
      // Admins can access all resources
      return next();
    }
    
    if (req.userType === 'student' && resourceId && resourceId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }
    
    next();
  };
};

// Middleware for optional authentication (for public routes that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    
    if (token) {
      const decoded = verifyToken(token);
      
      let user;
      if (decoded.userType === 'student') {
        user = await Student.findById(decoded.id).select('-password');
      } else if (decoded.userType === 'admin') {
        user = await Admin.findById(decoded.id).select('-password');
      }
      
      if (user && user.isActive) {
        req.user = user;
        req.userType = decoded.userType;
      }
    }
  } catch (error) {
    // Ignore authentication errors for optional auth
  }
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  checkPermission,
  checkOwnership,
  optionalAuth
};
