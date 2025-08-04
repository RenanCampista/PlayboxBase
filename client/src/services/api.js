import axios from 'axios';

/**
 * API Service para Playbox
 * 
 * Estrutura de Rotas:
 * - /auth/*    - Autenticação (login, logout, verificação, recuperação de senha)
 * - /users/*   - Operações com usuários (CRUD)
 * - /admin/*   - Operações administrativas
 * - /games/*   - Operações com jogos (futuro)
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    const response = await api.put('/auth/changePassword', {
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

  // Solicitar recuperação de senha
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgotPassword', { email });
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
  // Listar todos os usuários (admin)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Obter usuário por ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Criar usuário
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Atualizar usuário
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Deletar usuário (admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

// Serviços para jogos
export const gameService = {
  // Listar todos os jogos
  getGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },

  // Obter um jogo específico
  getGame: async (id) => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  // Criar um novo jogo (admin)
  createGame: async (gameData) => {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  // Atualizar um jogo (admin)
  updateGame: async (id, gameData) => {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  },

  // Deletar um jogo (admin)
  deleteGame: async (id) => {
    const response = await api.delete(`/games/${id}`);
    return response.data;
  },

  // Buscar jogos por gênero
  getGamesByGenre: async (genre) => {
    const response = await api.get(`/games/genre/${genre}`);
    return response.data;
  }
};

// Serviços de desenvolvimento/debug
export const devService = {
  // Listar todos os endpoints disponíveis
  listEndpoints: () => {
    return {
      auth: [
        'POST /auth/login - Fazer login',
        'GET /auth/verify - Verificar token',
        'PUT /auth/changePassword - Alterar senha',
        'POST /auth/logout - Fazer logout',
        'POST /auth/forgotPassword - Solicitar recuperação de senha',
        'POST /auth/resetPassword - Redefinir senha com token'
      ],
      users: [
        'GET /users - Listar todos os usuários (admin)',
        'GET /users/:id - Buscar usuário por ID',
        'POST /users - Criar usuário',
        'PUT /users/:id - Atualizar usuário',
        'DELETE /users/:id - Deletar usuário (admin)'
      ],
      games: [
        'GET /games - Listar todos os jogos',
        'GET /games/:id - Obter um jogo específico',
        'POST /games - Criar um novo jogo (admin)',
        'PUT /games/:id - Atualizar um jogo (admin)',
        'DELETE /games/:id - Deletar um jogo (admin)',
        'GET /games/genre/:genre - Buscar jogos por gênero'
      ],
      general: [
        'GET / - Informações da API'
      ]
    };
  },

  // Testar todas as rotas públicas
  testPublicRoutes: async () => {
    const results = {};
    
    try {
      const apiInfo = await api.get('/');
      results.api = { status: 'OK', data: apiInfo.data };
    } catch (error) {
      results.api = { status: 'ERROR', error: error.message };
    }

    return results;
  }
};

// Serviços para reviews
export const reviewService = {
  // Criar nova review
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Buscar reviews por ID do jogo
  getReviewsByGame: async (gameId) => {
    const response = await api.get(`/reviews/game/${gameId}`);
    return response.data;
  },

  // Buscar reviews por ID do usuário
  getReviewsByUser: async (userId) => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data;
  },

  // Atualizar review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Deletar review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};

export default api;
