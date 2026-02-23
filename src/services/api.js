import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const getAllUsers = () => API.get('/auth/users');

// Visitor APIs
export const createVisitor = (data) => API.post('/visitors', data);
export const getAllVisitors = () => API.get('/visitors');
export const getVisitorById = (id) => API.get(`/visitors/${id}`);
export const updateVisitor = (id, data) => API.put(`/visitors/${id}`, data);
export const approveVisitor = (id) => API.patch(`/visitors/${id}/approve`);
export const checkInVisitor = (data) => API.post('/visitors/check-in', data);
export const checkOutVisitor = (data) => API.post('/visitors/check-out', data);
export const deleteVisitor = (id) => API.delete(`/visitors/${id}`);
export const getDashboardStats = () => API.get('/visitors/stats');