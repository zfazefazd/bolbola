import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password, avatar) => 
    api.post('/auth/register', { username, email, password, avatar }),
  getProfile: () => api.get('/auth/me'),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (settings) => api.patch('/settings', settings),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getPredefined: () => api.get('/categories/predefined'),
  create: (categoryData) => api.post('/categories', categoryData),
  delete: (categoryId) => api.delete(`/categories/${categoryId}`),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (skillData) => api.post('/skills', skillData),
  update: (skillId, skillData) => api.put(`/skills/${skillId}`, skillData),
  delete: (skillId) => api.delete(`/skills/${skillId}`),
};

export const timeLogsAPI = {
  create: (timeLogData) => api.post('/time-logs', timeLogData),
  getAll: (skillId = null, limit = 50) => {
    const params = { limit };
    if (skillId) params.skill_id = skillId;
    return api.get('/time-logs', { params });
  },
};

export const leaderboardAPI = {
  get: (limit = 50) => api.get('/leaderboard', { params: { limit } }),
};

export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
};

export const questsAPI = {
  getAll: () => api.get('/quests'),
  claimReward: (questId) => api.post(`/quests/${questId}/claim`),
};

export const statsAPI = {
  getUserStats: () => api.get('/stats/user'),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.detail || error.response.data?.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

export default api;