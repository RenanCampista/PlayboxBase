// Constantes da aplicação
export const API_BASE_URL = 'http://localhost:3000';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  USERS: '/users'
};

export const MESSAGES = {
  LOADING: 'Carregando...',
  ERROR_GENERIC: 'Erro inesperado. Tente novamente.',
  SUCCESS_CREATE: 'Criado com sucesso!',
  SUCCESS_UPDATE: 'Atualizado com sucesso!',
  SUCCESS_DELETE: 'Removido com sucesso!'
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};
