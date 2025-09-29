module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/aura-hr-solutions',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // File upload configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // Email configuration (for notifications)
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // limit each IP to 100 requests per windowMs
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
