import React, { useState } from 'react';
import '../styles/ReviewForm.css';

const ReviewForm = ({ gameId, onSubmit, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    gameplayRating: 0,
    visualRating: 0,
    audioRating: 0,
    difficultyRating: 0,
    immersionRating: 0,
    historyRating: 0,
    comment: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRatingChange = (category, rating) => {
    setFormData(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que todas as avaliações foram preenchidas
    const ratings = [
      formData.gameplayRating,
      formData.visualRating,
      formData.audioRating,
      formData.difficultyRating,
      formData.immersionRating,
      formData.historyRating
    ];

    if (ratings.some(rating => rating === 0)) {
      setError('Por favor, avalie todos os aspectos do jogo (1-5 estrelas).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        ...formData,
        gameId: parseInt(gameId),
        userId: currentUser.id
      };

      await onSubmit(reviewData);
    } catch (err) {
      setError('Erro ao enviar avaliação: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => {
    const [hoverValue, setHoverValue] = useState(0);

    return (
      <div className="star-rating-container">
        <label className="rating-label">{label}</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star ${star <= (hoverValue || value) ? 'filled' : ''}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverValue(star)}
              onMouseLeave={() => setHoverValue(0)}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>Avaliar Jogo</h2>
          <button 
            type="button" 
            className="close-button"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="review-form">
          <div className="ratings-grid">
            <StarRating
              value={formData.gameplayRating}
              onChange={(rating) => handleRatingChange('gameplayRating', rating)}
              label="Gameplay"
            />
            <StarRating
              value={formData.visualRating}
              onChange={(rating) => handleRatingChange('visualRating', rating)}
              label="Visual"
            />
            <StarRating
              value={formData.audioRating}
              onChange={(rating) => handleRatingChange('audioRating', rating)}
              label="Áudio"
            />
            <StarRating
              value={formData.difficultyRating}
              onChange={(rating) => handleRatingChange('difficultyRating', rating)}
              label="Dificuldade"
            />
            <StarRating
              value={formData.immersionRating}
              onChange={(rating) => handleRatingChange('immersionRating', rating)}
              label="Imersão"
            />
            <StarRating
              value={formData.historyRating}
              onChange={(rating) => handleRatingChange('historyRating', rating)}
              label="História"
            />
          </div>

          <div className="comment-section">
            <label htmlFor="comment">Comentário (opcional)</label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Conte-nos o que achou do jogo..."
              rows="4"
            />
          </div>

          <div className="form-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Publicando...' : 'Publicar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;