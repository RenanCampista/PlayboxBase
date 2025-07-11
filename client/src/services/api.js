import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token de autenticação automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para lidar com respostas de erro de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token inválido ou expirado, fazer logout apenas se não for uma tentativa de login
      const isLoginAttempt = error.config?.url?.includes('/auth/login');
      if (!isLoginAttempt) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Não redirecionar automaticamente, deixar o App.js gerenciar isso
      }
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Verificar se está logado
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  // Alterar senha
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Verificar se está logado (local)
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Obter usuário atual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Criar primeiro admin
  createFirstAdmin: async (userData) => {
    const response = await api.post('/admin/create-first-admin', userData);
    return response.data;
  },

  // Solicitar recuperação de senha
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Redefinir senha com token
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }
};

// Serviços para usuários
export const userService = {
  // Listar todos os usuários
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obter um usuário específico
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Criar um novo usuário
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Atualizar um usuário
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deletar um usuário
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Testar conexão com a API
  testConnection: async () => {
    const response = await api.get('/');
    return response.data;
  },
};

export default api;
