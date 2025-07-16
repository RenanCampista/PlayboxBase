const express = require('express');
const reviewServices = require('../services/reviewServices.js');
const router = express.Router();

// === ROTAS DE AVALIAÇÕES ===
// Criar avaliação
router.post('/', async (req, res) => {
    try {
        const reviewData = req.body;
        const result = await reviewServices.createReview(reviewData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(400).json({ error: error.message });
    }
});

// Buscar avaliação por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await reviewServices.getReviewById(Number(id));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar avaliações por ID de jogo
router.get('/game/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;
        const result = await reviewServices.getReviewsByGameId(Number(gameId));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar avaliações:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar avaliações por ID de usuário
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await reviewServices.getReviewsByUserId(Number(userId));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar avaliações do usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar avaliação
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reviewData = req.body;
        const result = await reviewServices.updateReview(Number(id), reviewData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        res.status(400).json({ error: error.message });
    }
});

// Deletar avaliação
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await reviewServices.deleteReview(Number(id));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;