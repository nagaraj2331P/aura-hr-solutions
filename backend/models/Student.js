const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  skills: [{
    type: String,
    trim: true
  }],
  expertise: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  profilePic: {
    type: String,
    default: null
  },
  resumeLink: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  education: {
    degree: String,
    institution: String,
    year: Number
  },
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  timesheets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timesheet'
  }],
  totalHoursWorked: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
studentSchema.index({ email: 1 });
studentSchema.index({ skills: 1 });
studentSchema.index({ expertise: 1 });

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get student's active projects
studentSchema.methods.getActiveProjects = function() {
  return this.populate({
    path: 'projects',
    match: { status: { $in: ['assigned', 'in_progress'] } }
  });
};

// Calculate completion rate
studentSchema.methods.getCompletionRate = async function() {
  const totalProjects = this.projects.length;
  if (totalProjects === 0) return 0;
  
  const completedProjects = await mongoose.model('Project').countDocuments({
    _id: { $in: this.projects },
    status: 'completed'
  });
  
  return Math.round((completedProjects / totalProjects) * 100);
};

// Update last login
studentSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('Student', studentSchema);
