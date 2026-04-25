import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333' 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@VitareFisio:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona se o erro for 401 e NÃO for na rota de login
    if (error.response && error.response.status === 401 && !error.config.url?.includes('/login')) {
      localStorage.removeItem('@VitareFisio:token');
      localStorage.removeItem('@VitareFisio:user');
      
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;