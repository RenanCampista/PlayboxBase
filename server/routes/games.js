const express = require('express');
const gameServices = require('../services/gameServices.js');
const router = express.Router();

// === ROTAS DE JOGOS ===
// Criar jogo
router.post('/', async (req, res) => {
    try {
        const gameData = req.body;
        const result = await gameServices.createGame(gameData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao criar jogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Buscar jogo por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await gameServices.getGameById(Number(id));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Buscar jogo por nome
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Nome do jogo é obrigatório.' });
        }
        const result = await gameServices.getGameByName(name);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao buscar jogo por nome:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar todos os jogos
router.get('/', async (req, res) => {
    try {
        const result = await gameServices.getAllGames();
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar jogos:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar jogo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const gameData = req.body;
        const result = await gameServices.updateGame(Number(id), gameData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao atualizar jogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Deletar jogo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await gameServices.deleteGame(Number(id));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao deletar jogo:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Buscar jogos por gênero
router.get('/genre/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const result = await gameServices.getGamesByGenre(genre);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao buscar jogos por gênero:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Rota para recalcular todas as médias de avaliação (rota administrativa)
router.post('/admin/recalculateAverages', async (req, res) => {
    try {
        const result = await gameServices.recalculateAllGameAverages();
        res.status(200).json({ 
            message: 'Médias de avaliação recalculadas com sucesso',
            ...result
        });
    } catch (error) {
        console.error('Erro ao recalcular médias:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;