import prisma from "./services/prisma.js";
const express = require('express');
import * as userServices from './services/userServices.js';
import { authenticateToken, requireAdmin } from './services/userServices.js'; // Importar middleware
const router = express.Router();


// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar.' });
    }
    next();
};

// Rota de teste
router.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
});

// === ROTAS DE AUTENTICAÇÃO ===

// Login do usuário
router.post('/auth/login', async (req, res) => {
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
router.get('/auth/verify', authenticateToken, (req, res) => {
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
router.put('/auth/change-password', authenticateToken, async (req, res) => {
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
router.post('/auth/logout', (req, res) => {
    res.json({ message: 'Logout realizado com sucesso!' });
});

// === ROTAS DE RECUPERAÇÃO DE SENHA ===

// Solicitar recuperação de senha
router.post('/auth/forgot-password', async (req, res) => {
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
router.post('/auth/reset-password', async (req, res) => {
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

// === ROTAS DE USUÁRIOS ===

// Criar usuário
router.post('/users', async (req, res) => {
    try {
        const userData = req.body;
        const result = await userServices.createUser(userData);
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(400).json({ error: error.message });
    }
});

// Criar primeiro usuário admin (apenas se não existir nenhum admin)
router.post('/admin/create-first-admin', async (req, res) => {
    try {
        const result = await userServices.createFirstAdmin(req.body);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar todos os usuários (apenas admins)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const result = await userServices.getAllUsers();
        res.status(result.status).json(result);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Buscar usuário por ID (usuário autenticado pode ver seu próprio perfil ou admin pode ver qualquer um)
router.get('/users/:id', authenticateToken, async (req, res) => {
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
router.put('/users/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const userId = Number(id);

        // Verificar se o usuário está tentando atualizar seu próprio perfil ou se é admin
        if (req.user.id !== userId && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode atualizar seu próprio perfil.' });
        }

        if (!name || !email) {
            return res.status(400).json({ error: 'Username e email são obrigatóris.' });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {name, email},
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                updatedAt: true
            }
        });

        res.json(user);
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        } else if (error.code === 'P2002') {
            // Verificar qual campo está duplicado
            const field = error.meta?.target?.[0];
            if (field === 'name') {
                res.status(400).json({ error: 'Username já está em uso.' });
            } else if (field === 'email') {
                res.status(400).json({ error: 'Email já está em uso.' });
            } else {
                res.status(400).json({ error: 'Username ou email já estão em uso.' });
            }
        } else {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
});

// Deletar usuário (apenas admins)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.user.delete({
            where: { id: Number(id) }
        });

        res.json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        } else {
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

module.exports = router;