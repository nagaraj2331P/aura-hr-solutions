// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  userType: 'student' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  phone?: string;
  skills: string[];
  expertise: 'beginner' | 'intermediate' | 'advanced';
  education?: {
    degree: string;
    institution: string;
    year: number;
  };
  experience?: {
    company: string;
    role: string;
    duration: string;
  }[];
  profilePic?: string;
  resumeLink?: string;
  projects: string[];
  timesheets: string[];
}

export interface Admin extends User {
  role: 'super_admin' | 'hr_admin' | 'project_manager';
  department?: string;
  permissions: string[];
}

// Project Types
export interface Project {
  _id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  budget?: number;
  hourlyRate?: number;
  estimatedHours?: number;
  deadline?: string;
  status: 'draft' | 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string | Admin;
  assignedTo: {
    student: string | Student;
    assignedBy: string | Admin;
    assignedAt: string;
  }[];
  files: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    uploadedAt: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Submission Types
export interface Submission {
  _id: string;
  project: string | Project;
  student: string | Student;
  files: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
  }[];
  description?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_required';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string | Admin;
  feedback?: string;
  grade?: number;
  revisionHistory: {
    version: number;
    submittedAt: string;
    feedback?: string;
    status: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Timesheet Types
export interface Timesheet {
  _id: string;
  student: string | Student;
  project?: string | Project;
  date: string;
  loginTime: string;
  logoutTime?: string;
  breaks: {
    startTime: string;
    endTime?: string;
    duration?: number;
  }[];
  totalHours?: number;
  description?: string;
  status: 'active' | 'completed' | 'approved' | 'rejected';
  approvedBy?: string | Admin;
  approvedAt?: string;
  earnings?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    items?: T[];
    projects?: T[];
    students?: T[];
    submissions?: T[];
    timesheets?: T[];
    pagination: {
      current: number;
      pages: number;
      total: number;
    };
  };
}

// Dashboard Types
export interface StudentDashboard {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalHours: number;
    totalEarnings: number;
  };
  projects: Project[];
  submissions: Submission[];
  timesheets: Timesheet[];
}

export interface AdminDashboard {
  stats: {
    totalStudents: number;
    totalProjects: number;
    pendingSubmissions: number;
    pendingTimesheets: number;
  };
  recentSubmissions: Submission[];
  recentProjects: Project[];
  projectStats: {
    _id: string;
    count: number;
  }[];
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface StudentRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  skills: string[];
  expertise: 'beginner' | 'intermediate' | 'advanced';
  education?: {
    degree: string;
    institution: string;
    year: number;
  };
}

export interface ProjectForm {
  title: string;
  description: string;
  skillsRequired: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  budget?: number;
  hourlyRate?: number;
  estimatedHours?: number;
  deadline?: string;
}

// Filter Types
export interface ProjectFilters {
  skills?: string;
  difficulty?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface StudentFilters {
  search?: string;
  skills?: string;
  expertise?: string;
  page?: number;
  limit?: number;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: StudentRegisterForm) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Component Props Types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  [key: string]: any;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

// Utility Types
export type UserRole = 'student' | 'admin';
export type ProjectStatus = 'draft' | 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revision_required';
export type TimesheetStatus = 'active' | 'completed' | 'approved' | 'rejected';
export type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced';
