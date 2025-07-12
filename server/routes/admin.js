const express = require('express');
const userServices = require('../services/userServices.js');
const router = express.Router();

// === ROTAS DE ADMINISTRAÇÃO ===

// Criar primeiro usuário admin (apenas se não existir nenhum admin)
router.post('/create-first-admin', async (req, res) => {
    try {
        const result = await userServices.createFirstAdmin(req.body);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
