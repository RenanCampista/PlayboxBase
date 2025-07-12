const express = require('express');
const router = express.Router();

// Importar todas as rotas
const authRoutes = require('./auth.js');
const userRoutes = require('./users.js');
const adminRoutes = require('./admin.js');

// Rota de teste
router.get('/', (req, res) => {
    res.json({ 
        message: 'API Playbox funcionando!',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/*',
            users: '/users/*',
            admin: '/admin/*',
        }
    });
});

// Registrar as rotas com seus prefixos
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
