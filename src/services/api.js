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
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('authMethod', 'email');
        if (data.user_id) {
          localStorage.setItem('userId', data.user_id);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  signup: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        body: formData,
        // Remove default headers since FormData sets its own boundary
        headers: {
          // Let the browser set the Content-Type with boundary for FormData
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('authMethod', 'email');
        localStorage.setItem('userId', data.user_id);
      }
      
      return { data };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  googleAuth: async () => {
    try {
      window.location.href = `${API_BASE_URL}/oauth/auth/google`;
    } catch (error) {
      throw new Error('Google authentication failed');
    }
  },
  githubAuth: async () => {
    try {
      window.location.href = `${API_BASE_URL}/oauth/auth/github`;
    } catch (error) {
      throw new Error('GitHub authentication failed');
    }
  },
  sendOtp: async (phoneNumber) => {
    try {
      const response = await api.post('/auth/send-otp', { phone_number: phoneNumber });
      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to send verification code');
    }
  },
  verifyOtp: async (phoneNumber, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { 
        phone_number: phoneNumber,
        otp: otp 
      });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('authMethod', 'phone');
      }
      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error('Failed to verify code');
    }
  },
  phoneAuth: async (phoneNumber) => {
    try {
      const response = await api.post('/auth/phone-auth', { 
        phone_number: phoneNumber 
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Phone authentication failed');
      }
      throw new Error('Network error occurred');
    }
  },
  updatePhoneNumber: async (phoneNumber) => {
    try {
      const response = await api.post('/auth/update-phone', { 
        phone_number: phoneNumber 
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.detail || 'Failed to update phone number');
      }
      throw new Error('Network error occurred');
    }
  }
};

// Option 1: Remove the unused function
// Delete or comment out the validateAuthResponse function

// Option 2: Add eslint-disable comment if you plan to use it later
// eslint-disable-next-line no-unused-vars
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

export const phoneAuthService = {
  startVerification: async (phoneNumber) => {
    try {
      const response = await api.post('/auth/phone/start', {
        phone_number: phoneNumber.replace(/\D/g, '')
      });
      return response.data;
    } catch (error) {
      console.error('Start verification error:', error);
      throw new Error(error.response?.data?.detail || 'Failed to send verification code');
    }
  },

  verifyCode: async (phoneNumber, code) => {
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const response = await api.post('/auth/phone/verify', {
        phone_number: cleanPhone,
        otp: code
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userId', response.data.user_id);
        localStorage.setItem('authMethod', 'phone');
      }
      
      return response.data;
    } catch (error) {
      console.error('Verify code error:', error);
      throw new Error(error.response?.data?.detail || 'Verification failed');
    }
  }
};

export default api;
