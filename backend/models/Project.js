const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Project category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Analysis',
      'UI/UX Design',
      'Content Writing',
      'Digital Marketing',
      'Research',
      'Other'
    ]
  },
  skillsRequired: [{
    type: String,
    required: true,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  estimatedHours: {
    type: Number,
    required: [true, 'Estimated hours is required'],
    min: [1, 'Estimated hours must be at least 1']
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate cannot be negative']
  },
  totalBudget: {
    type: Number,
    default: function() {
      return this.estimatedHours * this.hourlyRate;
    }
  },
  deadline: {
    type: Date,
    required: [true, 'Project deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  files: [{
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'assigned', 'in_progress', 'submitted', 'under_review', 'completed', 'cancelled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }],
  maxStudents: {
    type: Number,
    default: 1,
    min: [1, 'Maximum students must be at least 1']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  deliverables: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  completedAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
projectSchema.index({ status: 1 });
projectSchema.index({ skillsRequired: 1 });
projectSchema.index({ difficulty: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ deadline: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ 'assignedTo.student': 1 });

// Virtual for calculating days until deadline
projectSchema.virtual('daysUntilDeadline').get(function() {
  if (!this.deadline) return null;
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for checking if project is overdue
projectSchema.virtual('isOverdue').get(function() {
  if (!this.deadline) return false;
  return new Date() > new Date(this.deadline) && this.status !== 'completed';
});

// Method to check if student can apply
projectSchema.methods.canStudentApply = function(studentId) {
  // Check if already assigned
  const isAssigned = this.assignedTo.some(assignment => 
    assignment.student.toString() === studentId.toString()
  );
  
  // Check if max students reached
  const maxReached = this.assignedTo.length >= this.maxStudents;
  
  // Check if project is available for assignment
  const isAvailable = ['published'].includes(this.status);
  
  return !isAssigned && !maxReached && isAvailable;
};

// Method to assign student to project
projectSchema.methods.assignStudent = function(studentId, adminId) {
  if (!this.canStudentApply(studentId)) {
    throw new Error('Student cannot be assigned to this project');
  }
  
  this.assignedTo.push({
    student: studentId,
    assignedBy: adminId,
    assignedAt: new Date()
  });
  
  // Update status if this is the first assignment
  if (this.status === 'published') {
    this.status = 'assigned';
  }
  
  return this.save();
};

// Method to get project progress
projectSchema.methods.getProgress = async function() {
  const submissions = await mongoose.model('Submission').find({
    project: this._id
  });
  
  if (submissions.length === 0) return 0;
  
  const completedSubmissions = submissions.filter(sub => sub.status === 'approved').length;
  return Math.round((completedSubmissions / submissions.length) * 100);
};

// Static method to find projects by skills
projectSchema.statics.findBySkills = function(skills, difficulty = null) {
  const query = {
    skillsRequired: { $in: skills },
    status: 'published',
    isActive: true
  };
  
  if (difficulty) {
    query.difficulty = difficulty;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

// Update totalBudget when estimatedHours or hourlyRate changes
projectSchema.pre('save', function(next) {
  if (this.isModified('estimatedHours') || this.isModified('hourlyRate')) {
    this.totalBudget = this.estimatedHours * this.hourlyRate;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
