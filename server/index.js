require('dotenv').config();
const express = require('express'); // Framework para construir APIs
const cors = require('cors'); // Middleware para habilitar CORS
const app = express();
const routes = require('./routes.js'); // Importa as rotas definidas

app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições
app.use(routes);

const PORT = process.env.PORT || 3000; // Define a porta do servidor

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}`);
});
