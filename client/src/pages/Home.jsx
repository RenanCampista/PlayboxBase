import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import '../styles/Home.css';

const Home = ({ onGameSelect }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getGames();
      setGames(response.games || []);
    } catch (err) {
      setError('Erro ao carregar jogos: ' + (err.response?.data?.error || err.message));
      console.error('Erro ao carregar jogos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (game) => {
    if (onGameSelect) {
      onGameSelect(game);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Carregando jogos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">{error}</div>
        <button onClick={loadGames} className="btn btn-primary">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Biblioteca de Jogos</h1>
        <p>Descubra e explore nossa coleção de jogos</p>
      </div>

      {games.length === 0 ? (
        <div className="no-games">
          <p>Nenhum jogo encontrado.</p>
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div 
              key={game.id} 
              className="game-card" 
              onClick={() => handleGameClick(game)}
            >
              <div className="game-image">
                {game.backgroundImage ? (
                  <img 
                    src={game.backgroundImage} 
                    alt={game.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-game.png';
                    }}
                  />
                ) : (
                  <div className="placeholder-image">
                    <span>Sem Imagem</span>
                  </div>
                )}
              </div>
              <div className="game-info">
                <h3 className="game-title">{game.name}</h3>
                <div className="game-meta">
                  {game.genres && game.genres.length > 0 && (
                    <span className="game-genre">
                      {game.genres[0]}
                    </span>
                  )}
                  {game.metacriticScore && (
                    <span className="game-score">
                      {game.metacriticScore}/100
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
