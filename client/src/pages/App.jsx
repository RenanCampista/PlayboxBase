import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import { UserList, UserForm, Header } from '../components';
import { Login, Register, ForgotPassword, Home, GameDetail, AdminPanel } from './';
import { userService, authService } from '../services/api';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Estados para navegação
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'admin', 'profile', 'game-detail'
  const [selectedGame, setSelectedGame] = useState(null);

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Carregar usuários quando está logado e é administrador
  useEffect(() => {
    if (isLoggedIn && currentUser?.isAdmin) {
      loadUsers();
      checkApiConnection();
    } else if (isLoggedIn) {
      // Para usuários comuns, apenas verificar conexão da API
      checkApiConnection();
    }
  }, [isLoggedIn, currentUser]);

  const checkAuthentication = async () => {
    try {
      setCheckingAuth(true);
      
      if (!authService.isLoggedIn()) {
        setIsLoggedIn(false);
        setCurrentUser(null);
        return;
      }

      // Verificar se o token é válido
      const response = await authService.verifyToken();
      setIsLoggedIn(true);
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Erro na verificação de autenticação:', error);
      setIsLoggedIn(false);
      setCurrentUser(null);
      // Token inválido será removido automaticamente pelo interceptor
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLoginSuccess = (user) => {
    console.log('Login success, setting user:', user);
    setIsLoggedIn(true);
    setCurrentUser(user);
    setShowRegister(false);
    setShowForgotPassword(false);
    setCurrentPage('home'); // Redirecionar para Home após login
    setError(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUsers([]);
    setEditingUser(null);
    setShowForm(false);
    setShowRegister(false);
    setShowForgotPassword(false);
    setError(null);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowForgotPassword(false);
    setError(null);
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
    setShowRegister(false);
    setError(null);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    setError(null);
  };

  const handleRegisterSuccess = (user) => {
    console.log('Register success, setting user:', user);
    setIsLoggedIn(true);
    setCurrentUser(user);
    setShowRegister(false);
    setShowForgotPassword(false);
    setCurrentPage('home'); // Redirecionar para Home após registro
    setError(null);
  };

  // Funções de navegação
  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setCurrentPage('game-detail');
  };

  const handleBackToHome = () => {
    setSelectedGame(null);
    setCurrentPage('home');
  };

  const handleShowAdmin = () => {
    setCurrentPage('admin');
  };

  const handleShowProfile = () => {
    setCurrentPage('profile');
  };

  const handleShowHome = () => {
    setCurrentPage('home');
  };

  const checkApiConnection = async () => {
    try {
      const response = await authService.verifyToken();
      setApiStatus(`API conectada - ${response.message || 'OK'}`);
    } catch (err) {
      setApiStatus('Erro ao conectar com a API');
      console.error('Erro ao testar conexão:', err);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar usuários: ' + (err.response?.data?.error || err.message));
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await userService.createUser(userData);
      setShowForm(false);
      if (currentUser?.isAdmin) {
        loadUsers();
      }
      setError(null);
    } catch (err) {
      setError('Erro ao criar usuário: ' + (err.response?.data?.error || err.message));
      console.error('Erro ao criar usuário:', err);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      await userService.updateUser(editingUser.id, userData);
      setEditingUser(null);
      setShowForm(false);
      if (currentUser?.isAdmin) {
        loadUsers();
      }
      setError(null);
    } catch (err) {
      setError('Erro ao atualizar usuário: ' + (err.response?.data?.error || err.message));
      console.error('Erro ao atualizar usuário:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await userService.deleteUser(userId);
        if (currentUser?.isAdmin) {
          loadUsers();
        }
        setError(null);
      } catch (err) {
        setError('Erro ao deletar usuário: ' + (err.response?.data?.error || err.message));
        console.error('Erro ao deletar usuário:', err);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = (userData) => {
    if (editingUser) {
      handleUpdateUser(userData);
    } else {
      handleCreateUser(userData);
    }
  };

  const handleCancelForm = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  return (
    <div className="App">
      {checkingAuth ? (
        <div className="loading-screen">
          <div className="loading">Verificando autenticação...</div>
        </div>
      ) : !isLoggedIn ? (
        showForgotPassword ? (
          <ForgotPassword 
            onBackToLogin={handleBackToLogin}
          />
        ) : showRegister ? (
          <Register 
            onRegisterSuccess={handleRegisterSuccess}
            onBackToLogin={handleBackToLogin}
          />
        ) : (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onShowRegister={handleShowRegister}
            onShowForgotPassword={handleShowForgotPassword}
          />
        )
      ) : (
        <>
          <Header 
            user={currentUser} 
            onLogout={handleLogout}
            onNavigate={(page) => {
              if (page === 'home') handleShowHome();
              else if (page === 'admin') handleShowAdmin();
              else if (page === 'profile') handleShowProfile();
            }}
            currentPage={currentPage}
          />
          
          <main className="App-main">
            {currentPage === 'home' && (
              <Home onGameSelect={handleGameSelect} />
            )}

            {currentPage === 'game-detail' && selectedGame && (
              <GameDetail 
                game={selectedGame} 
                onBack={handleBackToHome}
                currentUser={currentUser}
              />
            )}

            {currentPage === 'admin' && currentUser?.isAdmin && (
              <AdminPanel 
                currentUser={currentUser}
                onBack={handleBackToHome}
              />
            )}

            {currentPage === 'profile' && (
              <>
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                {showForm ? (
                  <UserForm
                    user={editingUser}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                  />
                ) : (
                  <div className="user-profile">
                    <h2>Meu Perfil</h2>
                    {currentUser ? (
                      <div className="profile-info">
                        <p><strong>Nome:</strong> {currentUser.name}</p>
                        <p><strong>Email:</strong> {currentUser.email}</p>
                        <p><strong>Tipo:</strong> {currentUser.isAdmin ? 'Administrador' : 'Usuário'}</p>
                      </div>
                    ) : (
                      <div className="loading">Carregando dados do usuário...</div>
                    )}
                    <button 
                      onClick={() => setEditingUser(currentUser) || setShowForm(true)}
                      className="btn btn-primary"
                      disabled={!currentUser}
                    >
                      Editar Perfil
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
