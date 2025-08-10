// Script de teste para validar a validação de gêneros
const gameServices = require('./server/services/gameServices.js');

async function testGenreValidation() {
    console.log('=== Testando validação de gêneros ===\n');

    // Teste 1: Gêneros válidos
    const validGameData = {
        name: "Test Game Valid Genres",
        description: "Game with valid genres",
        releaseDate: "2023-01-01",
        playtime: 10,
        platforms: ["PC"],
        genres: ["Action", "RPG"],  // Gêneros válidos
        publishers: ["Test Publisher"],
        metacriticScore: 85,
        screenshots: ["http://example.com/screenshot1.jpg"]
    };

    try {
        console.log('1. Testando com gêneros válidos...');
        const result1 = await gameServices.createGame(validGameData);
        console.log('✅ Sucesso com gêneros válidos:', result1.status);
    } catch (error) {
        console.log('❌ Erro inesperado com gêneros válidos:', error.message);
    }

    // Teste 2: Gêneros inválidos
    const invalidGameData = {
        name: "Test Game Invalid Genres",
        description: "Game with invalid genres",
        releaseDate: "2023-01-01",
        playtime: 10,
        platforms: ["PC"],
        genres: ["Action", "Horror"],  // "Horror" não é um gênero válido
        publishers: ["Test Publisher"],
        metacriticScore: 85,
        screenshots: ["http://example.com/screenshot1.jpg"]
    };

    try {
        console.log('2. Testando com gêneros inválidos...');
        const result2 = await gameServices.createGame(invalidGameData);
        console.log('❌ Deveria ter falhado, mas teve sucesso:', result2.status);
    } catch (error) {
        console.log('✅ Rejeitou corretamente gêneros inválidos:', error.message);
    }

    console.log('\n=== Fim dos testes ===');
}

testGenreValidation();
