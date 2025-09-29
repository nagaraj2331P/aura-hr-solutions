const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Generate tokens for user
const generateTokens = (user, userType) => {
  const payload = {
    id: user._id,
    email: user.email,
    userType: userType, // 'student' or 'admin'
    name: user.name
  };

  const accessToken = generateToken(payload);
  
  return {
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      userType: userType
    }
  };
};

// Extract token from request header
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return authHeader;
};

module.exports = {
  generateToken,
  verifyToken,
  generateTokens,
  extractToken
};
