// client/src/utils/api.js
import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Chat/Tutor API functions
export const tutorAPI = {
  askQuestion: (question, level = 'beginner') => api.post('/ask', { question, level }),
  explainCode: (code, level = 'beginner') => api.post('/code-explain', { code, level }),
  generateConceptMap: (topic) => api.post('/concept-map', { topic }),
  processImage: (formData) => api.post('/ocr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  generateQuiz: (quizData) => api.post('/quiz/generate', quizData),
  submitQuiz: (submissionData) => api.post('/quiz/submit', submissionData),
  generateFlashcards: (flashcardData) => api.post('/flashcards/generate', flashcardData)
};

// Dashboard API functions
export const dashboardAPI = {
  getDashboard: (userId) => api.get(`/dashboard/${userId}`),
  recordSession: (sessionData) => api.post('/dashboard/record', sessionData)
};

export default api;
