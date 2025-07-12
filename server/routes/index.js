const express = require('express');
const router = express.Router();

// Importar todas as rotas
const authRoutes = require('./auth.js');
const userRoutes = require('./users.js');

// Rota de teste
router.get('/', (req, res) => {
    res.json({ 
        message: 'API Playbox funcionando!',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/*',
            users: '/users/*',
        }
    });
});

// Registrar as rotas com seus prefixos
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
