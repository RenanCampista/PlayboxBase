const express = require('express');
const userServices = require('../services/userServices.js');
const { authenticateToken, requireAdmin } = require('../services/userServices.js');
const router = express.Router();

// === ROTAS DE USUÁRIOS ===

// Criar usuário
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        const result = await userServices.createUser(userData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os usuários (apenas admins)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await userServices.getAllUsers();
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Buscar usuário por ID (usuário autenticado pode ver seu próprio perfil ou admin pode ver qualquer um)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        // Verificar se o usuário está tentando acessar seu próprio perfil ou se é admin
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode ver seu próprio perfil.' });
        }

        const user = await userServices.getUserById(userId);
        res.status(user.status).json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Atualizar usuário (usuário pode atualizar seu próprio perfil ou admin pode atualizar qualquer um)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        // Verificar se o usuário está tentando atualizar seu próprio perfil ou se é admin
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode atualizar seu próprio perfil.' });
        }

        const result = await userServices.updateUser(userId, req.body);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(400).json({ error: error.message });
    }
});

// Deletar usuário (apenas admins)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = Number(id);

        const result = await userServices.deleteUser(userId);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
