import React from 'react';
import { authService } from '../services/api';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await authService.logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>CRUD Básico</h1>
        
        {user && (
          <div className="user-info">
            <span className="welcome-text">
              Olá, <strong>{user.name}</strong>
              {user.isAdmin && <span className="admin-badge">Admin</span>}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
