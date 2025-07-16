import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import '../styles/GameDetail.css';

const GameDetail = ({ game, onBack }) => {
  const [gameDetails, setGameDetails] = useState(game);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (game && game.id) {
      loadGameDetails(game.id);
    }
  }, [game]);

  const loadGameDetails = async (gameId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getGame(gameId);
      setGameDetails(response.game);
    } catch (err) {
      setError('Erro ao carregar detalhes do jogo: ' + (err.response?.data?.error || err.message));
      console.error('Erro ao carregar detalhes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não disponível';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="game-detail-container">
        <div className="loading">Carregando detalhes do jogo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={onBack} className="btn btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  if (!gameDetails) {
    return (
      <div className="game-detail-container">
        <div className="error-message">Jogo não encontrado</div>
        <button onClick={onBack} className="btn btn-secondary">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="game-detail-container">
      <div className="game-detail-header">
        <button onClick={onBack} className="btn btn-secondary back-button">
          ← Voltar
        </button>
      </div>

      <div className="game-detail-content">
        <div className="game-hero">
          <div className="game-image-large">
            {gameDetails.backgroundImage ? (
              <img 
                src={gameDetails.backgroundImage} 
                alt={gameDetails.name}
                onError={(e) => {
                  e.target.src = '/placeholder-game.png';
                }}
              />
            ) : (
              <div className="placeholder-image-large">
                <span>Sem Imagem</span>
              </div>
            )}
          </div>
          <div className="game-info-main">
            <h1 className="game-title-large">{gameDetails.name}</h1>
            <div className="game-meta-large">
              {gameDetails.metacriticScore && (
                <div className="score-badge">
                  <span className="score-label">Metacritic</span>
                  <span className="score-value">{gameDetails.metacriticScore}/100</span>
                </div>
              )}
              {gameDetails.releaseDate && (
                <div className="release-date">
                  <span className="label">Lançamento:</span>
                  <span className="value">{formatDate(gameDetails.releaseDate)}</span>
                </div>
              )}
              {gameDetails.playtime && (
                <div className="playtime">
                  <span className="label">Tempo de jogo:</span>
                  <span className="value">{gameDetails.playtime}h</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="game-details-grid">
          <div className="game-description">
            <h2>Descrição</h2>
            <p>{gameDetails.description || 'Descrição não disponível.'}</p>
          </div>

          <div className="game-sidebar">
            {gameDetails.genres && gameDetails.genres.length > 0 && (
              <div className="detail-section">
                <h3>Gêneros</h3>
                <div className="genre-tags">
                  {gameDetails.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gameDetails.platforms && gameDetails.platforms.length > 0 && (
              <div className="detail-section">
                <h3>Plataformas</h3>
                <div className="platform-list">
                  {gameDetails.platforms.map((platform, index) => (
                    <span key={index} className="platform-item">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gameDetails.publishers && gameDetails.publishers.length > 0 && (
              <div className="detail-section">
                <h3>Editoras</h3>
                <div className="publisher-list">
                  {gameDetails.publishers.map((publisher, index) => (
                    <span key={index} className="publisher-item">
                      {publisher}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {gameDetails.screenshots && gameDetails.screenshots.length > 0 && (
          <div className="screenshots-section">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {gameDetails.screenshots.slice(0, 6).map((screenshot, index) => (
                <div key={index} className="screenshot-item">
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetail;
