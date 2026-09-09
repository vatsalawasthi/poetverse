import axios from 'axios';

// Use environment variable if provided (e.g. from Render or backend URL), otherwise default to relative /api
const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  getByUsername: (username) => api.get(`/users/username/${username}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  toggleFollow: (targetUserId, currentUserId) => 
    api.post(`/users/${targetUserId}/follow?currentUserId=${currentUserId}`),
  toggleBookmark: (userId, poemId) => 
    api.post(`/users/${userId}/bookmark?poemId=${poemId}`),
};

export const poemAPI = {
  getFeed: (params = {}) => api.get('/poems', { params }),
  getById: (id) => api.get(`/poems/${id}`),
  getByAuthor: (authorId) => api.get(`/poems/author/${authorId}`),
  create: (authorId, poemData) => api.post(`/poems?authorId=${authorId}`, poemData),
  update: (id, userId, poemData) => api.put(`/poems/${id}?userId=${userId}`, poemData),
  delete: (id, userId) => api.delete(`/poems/${id}?userId=${userId}`),
  toggleLike: (id, userId) => api.post(`/poems/${id}/like?userId=${userId}`),
};

export const collabAPI = {
  getAll: (status) => api.get('/collaborations', { params: { status } }),
  getById: (id) => api.get(`/collaborations/${id}`),
  create: (userId, collabData) => api.post(`/collaborations?userId=${userId}`, collabData),
  submitStanza: (id, userId, stanzaData) => 
    api.post(`/collaborations/${id}/stanza?userId=${userId}`, stanzaData),
};

export const matchmakerAPI = {
  getMatches: (userId) => api.get(`/matchmaker/${userId}`),
};

export const commentAPI = {
  getByPoem: (poemId) => api.get(`/comments/poem/${poemId}`),
  addComment: (data) => api.post('/comments', data),
};

export default api;
