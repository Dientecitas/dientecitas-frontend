import axios from 'axios';
import Cookies from 'js-cookie';

// Configuración base de axios
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Interceptor para agregar token a requests
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

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      Cookies.remove('token');
      Cookies.remove('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;