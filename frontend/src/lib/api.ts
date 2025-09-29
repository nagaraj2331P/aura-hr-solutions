import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { ApiResponse, PaginatedResponse } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any): Promise<ApiResponse> => {
    const response = await api.post('/auth/register/student', userData);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData: any): Promise<ApiResponse> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },
};

// Student API
export const studentApi = {
  getDashboard: async (): Promise<ApiResponse> => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },

  getProjects: async (filters?: any): Promise<PaginatedResponse> => {
    const response = await api.get('/students/projects', { params: filters });
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getDashboard: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStudents: async (filters?: any): Promise<PaginatedResponse> => {
    const response = await api.get('/admin/students', { params: filters });
    return response.data;
  },
};

// Project API
export const projectApi = {
  getAll: async (filters?: any): Promise<PaginatedResponse> => {
    const response = await api.get('/projects', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (projectData: any): Promise<ApiResponse> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  update: async (id: string, projectData: any): Promise<ApiResponse> => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  assign: async (id: string, studentIds: string[]): Promise<ApiResponse> => {
    const response = await api.post(`/projects/${id}/assign`, { studentIds });
    return response.data;
  },
};

// Submission API
export const submissionApi = {
  getAll: async (filters?: any): Promise<PaginatedResponse> => {
    const response = await api.get('/submissions', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  },

  create: async (submissionData: any): Promise<ApiResponse> => {
    const response = await api.post('/submissions', submissionData);
    return response.data;
  },

  update: async (id: string, submissionData: any): Promise<ApiResponse> => {
    const response = await api.put(`/submissions/${id}`, submissionData);
    return response.data;
  },

  review: async (id: string, reviewData: {
    status: string;
    feedback?: string;
    grade?: number;
  }): Promise<ApiResponse> => {
    const response = await api.post(`/submissions/${id}/review`, reviewData);
    return response.data;
  },
};

// Timesheet API
export const timesheetApi = {
  getAll: async (filters?: any): Promise<PaginatedResponse> => {
    const response = await api.get('/timesheets', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse> => {
    const response = await api.get(`/timesheets/${id}`);
    return response.data;
  },

  clockIn: async (projectId?: string): Promise<ApiResponse> => {
    const response = await api.post('/timesheets/clock-in', { projectId });
    return response.data;
  },

  clockOut: async (timesheetId: string): Promise<ApiResponse> => {
    const response = await api.post(`/timesheets/${timesheetId}/clock-out`);
    return response.data;
  },

  startBreak: async (timesheetId: string): Promise<ApiResponse> => {
    const response = await api.post(`/timesheets/${timesheetId}/break-start`);
    return response.data;
  },

  endBreak: async (timesheetId: string): Promise<ApiResponse> => {
    const response = await api.post(`/timesheets/${timesheetId}/break-end`);
    return response.data;
  },

  approve: async (id: string): Promise<ApiResponse> => {
    const response = await api.post(`/timesheets/${id}/approve`);
    return response.data;
  },

  reject: async (id: string, reason?: string): Promise<ApiResponse> => {
    const response = await api.post(`/timesheets/${id}/reject`, { reason });
    return response.data;
  },
};

// File API
export const fileApi = {
  uploadResume: async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/files/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadProfilePic: async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('profilePic', file);
    const response = await api.post('/files/upload/profile-pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadProjectFiles: async (files: File[]): Promise<ApiResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('projectFiles', file);
    });
    const response = await api.post('/files/upload/project', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadSubmissionFiles: async (files: File[]): Promise<ApiResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('submissionFiles', file);
    });
    const response = await api.post('/files/upload/submission', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  download: async (filename: string): Promise<Blob> => {
    const response = await api.get(`/files/download/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
