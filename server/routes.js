import prisma from "./services/prisma.js";
const express = require('express');
const bcrypt = require('bcryptjs'); // Biblioteca para criptografia de senhas
const jwt = require('jsonwebtoken'); // Biblioteca para gerar e verificar tokens JWT
import * as userServices from './services/userServices.js';
const router = express.Router();

// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';

// Middleware para verificar autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido.' });
        }
        req.user = user;
        next(); // Chama o próximo middleware ou rota
    });
};

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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        // Buscar usuário pelo email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                isAdmin: user.isAdmin 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
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

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
        }

        // Buscar usuário atual
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Verificar senha atual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ error: 'Senha atual incorreta.' });
        }

        // Hash da nova senha
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Atualizar senha
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedNewPassword }
        });

        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
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

        // Verificar se o usuário existe
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.json({ 
                message: 'Se o email existir no sistema, você receberá instruções para redefinir sua senha.' 
            });
        }

        // Gerar token de recuperação (válido por 1 hora)
        const resetToken = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                type: 'password-reset'
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Em produção, enviar este token por email
        res.json({
            message: 'Token de recuperação gerado com sucesso!',
            resetToken: resetToken, // ⚠️ Em produção, remova esta linha e envie por email
            instructions: 'Em produção, este token seria enviado por email. Use-o na rota /auth/reset-password'
        });

    } catch (error) {
        console.error('Erro ao solicitar recuperação de senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Redefinir senha com token
router.post('/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' });
        }

        // Verificar e decodificar o token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        // Verificar se é um token de reset de senha
        if (decoded.type !== 'password-reset') {
            return res.status(400).json({ error: 'Tipo de token inválido.' });
        }

        // Verificar se o usuário ainda existe
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualizar a senha no banco
        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Senha redefinida com sucesso! Você já pode fazer login com a nova senha.' });

    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
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
        // Verificar se já existe algum admin
        const existingAdmin = await prisma.user.findFirst({
            where: { isAdmin: true }
        });

        if (existingAdmin) {
            return res.status(400).json({ error: 'Já existe um administrador no sistema.' });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Username, email e senha são obrigatórios.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isAdmin: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true
            }
        });

        res.status(201).json({
            message: 'Primeiro administrador criado com sucesso!',
            user: admin
        });
    } catch (error) {
        console.error('Erro ao criar administrador:', error);
        
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            if (field === 'name') {
                res.status(400).json({ error: 'Username já está em uso.'});
            } else if (field === 'email') {
                res.status(400).json({ error: 'Email já está em uso.' });
            } else {
                res.status(400).json({ error: 'Username ou Email já está em uso.' });
            }
        } else {
            console.error('Erro ao criar administrador:', error);
            res.status(500).json({ error: 'Erro interno do servidor.' })
        }
    }
});

// Listar todos os usuários (apenas admins)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
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

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(user);
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

// Exemplo de rota protegida
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Você acessou uma rota protegida!', user: req.user });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

module.exports = router;