require('dotenv').config();
const express = require('express'); // Framework para construir APIs
const cors = require('cors'); // Middleware para habilitar CORS
const { PrismaClient } = require('@prisma/client'); // Importar Prisma para graceful shutdown
const app = express();
const routes = require('./routes/index.js'); // Importa as rotas organizadas

const prisma = new PrismaClient();

app.use(cors()); // Habilita CORS para todas as rotas. CORS é necessário para permitir que o frontend acesse a API
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições
app.use(routes);

const PORT = process.env.PORT || 3000; // Define a porta do servidor

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🔄 Encerrando servidor graciosamente...');
    await prisma.$disconnect();
    console.log('✅ Conexão com banco de dados encerrada');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🔄 Encerrando servidor graciosamente...');
    await prisma.$disconnect();
    console.log('✅ Conexão com banco de dados encerrada');
    process.exit(0);
});
