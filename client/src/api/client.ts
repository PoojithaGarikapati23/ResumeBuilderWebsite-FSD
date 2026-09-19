import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hercart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized and not already on login/public page, handle gracefully
      const isAuthRoute = window.location.pathname.includes('/login') || window.location.pathname === '/' || window.location.pathname.includes('/shop');
      if (!isAuthRoute && !localStorage.getItem('hercart_token')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
