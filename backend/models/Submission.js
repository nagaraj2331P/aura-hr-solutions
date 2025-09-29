const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project reference is required']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  title: {
    type: String,
    required: [true, 'Submission title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Submission description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
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
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_required'],
    default: 'draft'
  },
  submittedAt: {
    type: Date,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  },
  grade: {
    type: Number,
    min: [0, 'Grade cannot be negative'],
    max: [100, 'Grade cannot exceed 100']
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Hours worked is required'],
    min: [0, 'Hours worked cannot be negative']
  },
  earnings: {
    type: Number,
    default: 0,
    min: [0, 'Earnings cannot be negative']
  },
  revisionHistory: [{
    version: {
      type: Number,
      required: true
    },
    submittedAt: {
      type: Date,
      required: true
    },
    feedback: String,
    files: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimetype: String
    }]
  }],
  isLate: {
    type: Boolean,
    default: false
  },
  qualityScore: {
    type: Number,
    min: [1, 'Quality score must be at least 1'],
    max: [5, 'Quality score cannot exceed 5']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
submissionSchema.index({ project: 1, student: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ submittedAt: 1 });
submissionSchema.index({ reviewedBy: 1 });
submissionSchema.index({ student: 1, status: 1 });

// Virtual for calculating submission version
submissionSchema.virtual('currentVersion').get(function() {
  return this.revisionHistory.length + 1;
});

// Virtual for checking if submission is overdue
submissionSchema.virtual('isOverdue').get(function() {
  if (!this.project || !this.project.deadline) return false;
  return new Date() > new Date(this.project.deadline) && this.status !== 'approved';
});

// Method to submit the work
submissionSchema.methods.submit = function() {
  if (this.status !== 'draft') {
    throw new Error('Only draft submissions can be submitted');
  }
  
  this.status = 'submitted';
  this.submittedAt = new Date();
  
  // Check if submission is late
  if (this.project && this.project.deadline) {
    this.isLate = new Date() > new Date(this.project.deadline);
  }
  
  return this.save();
};

// Method to approve submission
submissionSchema.methods.approve = function(adminId, feedback = '', grade = null) {
  this.status = 'approved';
  this.reviewedAt = new Date();
  this.reviewedBy = adminId;
  this.feedback = feedback;
  
  if (grade !== null) {
    this.grade = grade;
  }
  
  // Calculate earnings based on hours worked and project hourly rate
  if (this.project && this.project.hourlyRate) {
    this.earnings = this.hoursWorked * this.project.hourlyRate;
  }
  
  return this.save();
};

// Method to reject submission
submissionSchema.methods.reject = function(adminId, feedback) {
  this.status = 'rejected';
  this.reviewedAt = new Date();
  this.reviewedBy = adminId;
  this.feedback = feedback;
  
  return this.save();
};

// Method to request revision
submissionSchema.methods.requestRevision = function(adminId, feedback) {
  // Save current version to history
  this.revisionHistory.push({
    version: this.currentVersion,
    submittedAt: this.submittedAt,
    feedback: this.feedback,
    files: this.files
  });
  
  this.status = 'revision_required';
  this.reviewedAt = new Date();
  this.reviewedBy = adminId;
  this.feedback = feedback;
  
  return this.save();
};

// Method to resubmit after revision
submissionSchema.methods.resubmit = function() {
  if (this.status !== 'revision_required') {
    throw new Error('Only submissions requiring revision can be resubmitted');
  }
  
  this.status = 'submitted';
  this.submittedAt = new Date();
  this.reviewedAt = null;
  this.reviewedBy = null;
  
  return this.save();
};

// Static method to get submissions by status
submissionSchema.statics.getByStatus = function(status, limit = 10) {
  return this.find({ status })
    .populate('project', 'title deadline')
    .populate('student', 'name email')
    .sort({ submittedAt: -1 })
    .limit(limit);
};

// Static method to get student's submissions
submissionSchema.statics.getStudentSubmissions = function(studentId, status = null) {
  const query = { student: studentId };
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate('project', 'title deadline hourlyRate')
    .sort({ submittedAt: -1 });
};

// Pre-save middleware to calculate earnings
submissionSchema.pre('save', async function(next) {
  if (this.isModified('hoursWorked') || this.isModified('status')) {
    if (this.status === 'approved' && this.hoursWorked > 0) {
      // Populate project if not already populated
      if (!this.project.hourlyRate) {
        await this.populate('project', 'hourlyRate');
      }
      
      if (this.project && this.project.hourlyRate) {
        this.earnings = this.hoursWorked * this.project.hourlyRate;
      }
    }
  }
  next();
});

module.exports = mongoose.model('Submission', submissionSchema);
