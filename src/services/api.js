import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authMethod');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return validateAuthResponse(response);
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },
  googleAuth: async () => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = `${API_BASE_URL}/oauth/auth/google`;
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  },
  githubAuth: async () => {
    try {
      // Redirect to GitHub OAuth endpoint
      window.location.href = `${API_BASE_URL}/oauth/auth/github`;
    } catch (error) {
      throw new Error('GitHub authentication failed');
    }
  },
};

const validateAuthResponse = (response) => {
  if (!response.data.access_token) {
    throw new Error('Invalid authentication response');
  }
  return response;
};

// Profile services
export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  uploadProfilePic: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/auth/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Project services
export const projectService = {
  getAllProjects: () => api.get('/projects'),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export default api;
