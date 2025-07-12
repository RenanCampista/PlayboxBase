const express = require('express');
const userServices = require('../services/userServices.js');
const { authenticateToken } = require('../services/userServices.js');
const router = express.Router();

// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';

// === ROTAS DE AUTENTICAÇÃO ===

// Login do usuário
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        const result = await userServices.authenticateUser(email, password);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(400).json({ error: error.message });
    }
});

// Verificar se o token é válido
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        message: 'Token válido',
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin
        }
    });
});

// Alterar senha do usuário logado
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
        }

        const result = await userServices.changePassword(req.user.id, currentPassword, newPassword);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Logout (opcional - no frontend, basta remover o token do localStorage)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout realizado com sucesso!' });
});

// === ROTAS DE RECUPERAÇÃO DE SENHA ===

// Solicitar recuperação de senha
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório.' });
        }

        const result = await userServices.requestPasswordReset(email, JWT_SECRET);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Redefinir senha com token
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
        }

        const result = await userServices.resetPassword(token, newPassword, JWT_SECRET);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
