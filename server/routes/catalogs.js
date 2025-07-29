const express = require('express');
const catalogServices = require('../services/catalogServices.js');
const router = express.Router();

// === ROTAS DE CATÁLOGOS ===
// Criar catálogo
router.post('/', async (req, res) => {
    try {
        const catalogData = req.body;
        const result = await catalogServices.createCatalog(catalogData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao criar catálogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Buscar catálogo por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await catalogServices.getCatalogById(Number(id));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao buscar catálogo:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Listar catálogos por ID de usuário
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await catalogServices.getCatalogsByUserId(Number(userId));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar catálogos:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar catálogo
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const catalogData = req.body;
        const result = await catalogServices.updateCatalog(Number(id), catalogData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao atualizar catálogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Deletar catálogo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await catalogServices.deleteCatalog(Number(id));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao deletar catálogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Adicionar jogo ao catálogo
router.post('/:catalogId/games', async (req, res) => {
    try {
        const { catalogId } = req.params;
        const { gameId } = req.body;
        const result = await catalogServices.addGameToCatalog(Number(catalogId), Number(gameId));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao adicionar jogo ao catálogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Remover jogo do catálogo
router.delete('/:catalogId/games/:gameId', async (req, res) => {
    try {
        const { catalogId, gameId } = req.params;
        const result = await catalogServices.removeGameFromCatalog(Number(catalogId), Number(gameId));
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao remover jogo do catálogo:', error);
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os catálogos
router.get('/', async (req, res) => {
    try {
        const result = await catalogServices.getAllCatalogs();
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar catálogos:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

module.exports = router;