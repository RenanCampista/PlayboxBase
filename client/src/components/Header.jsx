import React from 'react';
import { authService } from '../services/api';
import '../styles/Header.css';

const Header = ({ user, onLogout, onNavigate, currentPage }) => {
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
        <h1 
          onClick={() => onNavigate && onNavigate('home')}
          className="header-title"
        >
          Playbox
        </h1>
        
        <nav className="header-nav">
          <button 
            onClick={() => onNavigate && onNavigate('home')}
            className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          {user?.isAdmin && (
            <button 
              onClick={() => onNavigate && onNavigate('admin')}
              className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
            >
              Admin
            </button>
          )}
          <button 
            onClick={() => onNavigate && onNavigate('profile')}
            className={`nav-button ${currentPage === 'profile' ? 'active' : ''}`}
          >
            Perfil
          </button>
        </nav>
        
        {user && (
          <div className="user-info">
            <span className="welcome-text">
              <strong>{user.name}</strong>
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
