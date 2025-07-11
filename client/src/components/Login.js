import React, { useState } from 'react';
import { authService } from '../services/api';
import './Login.css';

const Login = ({ onLoginSuccess, onShowRegister, onShowForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Limpar erro quando usuário digita
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Tentando fazer login...');

    try {
      const response = await authService.login(formData.email, formData.password);
      console.log('Login bem-sucedido:', response.user);
      
      // Notificar componente pai sobre o login bem-sucedido
      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.response?.data?.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="forgot-password-link">
          <button 
            type="button" 
            className="forgot-password-button"
            onClick={onShowForgotPassword}
            disabled={loading}
          >
            Esqueci minha senha
          </button>
        </div>

        <div className="register-link">
          <p>Ainda não tem uma conta?</p>
          <button 
            type="button" 
            className="register-button"
            onClick={onShowRegister}
            disabled={loading}
          >
            Criar Conta
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
