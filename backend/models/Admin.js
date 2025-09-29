const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  department: {
    type: String,
    default: 'HR'
  },
  permissions: [{
    type: String,
    enum: [
      'manage_students',
      'manage_projects',
      'review_submissions',
      'approve_timesheets',
      'generate_reports',
      'manage_admins'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if admin has specific permission
adminSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission) || this.role === 'super_admin';
};

// Update last login
adminSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Set default permissions based on role
adminSchema.pre('save', function(next) {
  if (this.isNew && this.permissions.length === 0) {
    if (this.role === 'super_admin') {
      this.permissions = [
        'manage_students',
        'manage_projects',
        'review_submissions',
        'approve_timesheets',
        'generate_reports',
        'manage_admins'
      ];
    } else {
      this.permissions = [
        'manage_students',
        'manage_projects',
        'review_submissions',
        'approve_timesheets',
        'generate_reports'
      ];
    }
  }
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
