import React, { useState } from 'react';
import { authService } from '../services/api';
import '../styles/ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1); // 1: solicitar email, 2: inserir token e nova senha
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.forgotPassword(email);
      
      // Em produção, este token seria enviado por email
      setResetToken(response.resetToken);
      setStep(2);
      
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      setError(error.response?.data?.error || 'Erro ao solicitar recuperação de senha');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tokenToUse = token || resetToken; // Usar token inserido ou o gerado
      await authService.resetPassword(tokenToUse, newPassword);
      
      // Sucesso - voltar para login
      alert('Senha redefinida com sucesso! Você já pode fazer login com a nova senha.');
      onBackToLogin();
      
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setError(error.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        {step === 1 ? (
          <>
            <h2>Esqueci minha senha</h2>
            <p>Digite seu email para receber instruções de recuperação de senha.</p>
            
            <form onSubmit={handleEmailSubmit}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Instruções'}
                </button>
                
                <button 
                  type="button" 
                  className="back-button"
                  onClick={onBackToLogin}
                  disabled={loading}
                >
                  Voltar ao Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>Redefinir Senha</h2>
            <p>Instruções enviadas! Use o token abaixo ou insira o token que você recebeu por email.</p>
            
            {resetToken && (
              <div className="token-display">
                <strong>Token de demonstração:</strong>
                <code>{resetToken}</code>
                <small>Em produção, este token seria enviado por email.</small>
              </div>
            )}
            
            <form onSubmit={handlePasswordReset}>
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="token">Token de Recuperação:</label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={loading}
                  placeholder={resetToken ? "Token preenchido automaticamente" : "Cole o token aqui"}
                />
                <small>Se você não inserir um token, usaremos o token gerado automaticamente acima.</small>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nova Senha:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Nova Senha:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite a nova senha novamente"
                />
              </div>

              <div className="form-buttons">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>
                
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  Voltar
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
