const prisma = require("./prisma.js")
const fs = require('fs');

// Função para converter gêneros do JSON para o formato do enum
const convertGenresToEnum = (genres) => {
    const genreMap = {
        'Action': 'ACTION',
        'Adventure': 'ADVENTURE', 
        'Indie': 'INDIE',
        'Massively Multiplayer': 'MASSIVELY_MULTIPLAYER',
        'Platformer': 'PLATFORMER',
        'Puzzle': 'PUZZLE',
        'RPG': 'RPG',
        'Racing': 'RACING',
        'Shooter': 'SHOOTER',
        'Sports': 'SPORTS'
    };
    
    const convertedGenres = genres.map(genre => genreMap[genre] || 'PLACEHOLDER');
    return convertedGenres.join(',');
};

// Função para converter arrays em strings separadas por vírgula
const arrayToString = (array) => {
    return Array.isArray(array) ? array.join(',') : '';
};

// Função para converter strings em arrays
const stringToArray = (str) => {
    return str ? str.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];
};

// Função para formatar o jogo para retorno (converter strings em arrays)
const formatGameForResponse = (game) => {
    if (!game) return null;
    
    return {
        ...game,
        platforms: stringToArray(game.platforms),
        genres: stringToArray(game.genres),
        publishers: stringToArray(game.publishers),
        screenshots: stringToArray(game.screenshots)
    };
};


const createGame = async (gameData) => {
    const { name, description, backgroundImage, releaseDate, playtime, platforms, genres, publishers, metacriticScore, screenshots } = gameData;

    try {
        // Converter arrays para strings separadas por vírgula
        const convertedGenres = convertGenresToEnum(genres);
        const platformsString = arrayToString(platforms);
        const publishersString = arrayToString(publishers);
        const screenshotsString = arrayToString(screenshots);
        
        // verificar se ja possui um jogo com esse nome
        try {
            const verifyGame = await getGameByName(name);
            if (verifyGame.status === 200) {
                return { status: 409, message: 'Este jogo já se encontra no banco de dados'};
            }
        } catch (error) {
            // Se der erro na verificação, continua com a criação
            console.log('Aviso: Erro ao verificar jogo existente, continuando com criação:', error.message);
        }

        const game = await prisma.game.create({
            data: {
                name,
                description,
                backgroundImage,
                releaseDate,
                playtime,
                platforms: platformsString,
                genres: convertedGenres,
                publishers: publishersString,
                metacriticScore,
                screenshots: screenshotsString
            }
        });
        
        // Formatar o jogo para retorno (converter strings em arrays)
        const formattedGame = formatGameForResponse(game);
        
        return { status: 200, game: formattedGame}
    } catch (error) {
        console.error('Erro ao criar jogo:', error);
        throw new Error('Erro ao criar jogo');
    }
}

const getGameById = async (id) => {
    try {
        const game = await prisma.game.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                backgroundImage: true,
                releaseDate: true,
                playtime: true,
                platforms: true,
                genres: true,
                publishers: true,
                metacriticScore: true,
                screenshots: true,
                createdAt: true,
            }
        });
        if (!game) {
            return { status: 404, message: 'Jogo não encontrado' };
        }
        
        // Formatar o jogo para retorno (converter strings em arrays)
        const formattedGame = formatGameForResponse(game);
        
        return { status: 200, game: formattedGame };
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        throw new Error('Erro ao buscar jogo');
    }
}

const getGameByName = async (name) => {
    try {
        const game = await prisma.game.findFirst({
            where: { name },
            select: {
                id: true,
                name: true,
                description: true,
                backgroundImage: true,
                releaseDate: true,
                playtime: true,
                platforms: true,
                genres: true,
                publishers: true,
                metacriticScore: true,
                screenshots: true,
                createdAt: true,
            }
        });
        if (!game) {
            return { status: 404, message: 'Jogo não encontrado' };
        }
        
        // Formatar o jogo para retorno (converter strings em arrays)
        const formattedGame = formatGameForResponse(game);
        
        return { status: 200, game: formattedGame };
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        throw new Error('Erro ao buscar jogo');
    }
}

const updateGame = async (id, gameData) => {
    const { name, description, backgroundImage, releaseDate, playtime, platforms, genres, publishers, metacriticScore, screenshots } = gameData;

    try {
        // Converter arrays para strings separadas por vírgula se fornecidos
        const convertedGenres = genres ? convertGenresToEnum(genres) : undefined;
        const platformsString = platforms ? arrayToString(platforms) : undefined;
        const publishersString = publishers ? arrayToString(publishers) : undefined;
        const screenshotsString = screenshots ? arrayToString(screenshots) : undefined;
        
        const updatedGame = await prisma.game.update({
            where: { id },
            data: {
                name,
                description,
                backgroundImage,
                releaseDate,
                playtime,
                platforms: platformsString,
                genres: convertedGenres,
                publishers: publishersString,
                metacriticScore,
                screenshots: screenshotsString
            }
        });
        
        // Formatar o jogo para retorno (converter strings em arrays)
        const formattedGame = formatGameForResponse(updatedGame);
        
        return { status: 200, updatedGame: formattedGame };
    } catch (error) {
        console.error('Erro ao atualizar jogo:', error);
        throw new Error('Erro ao atualizar jogo');
    }
}

const deleteGame = async (id) => {
    try {
        const deletedGame = await prisma.game.delete({
            where: { id }
        });
        return { status: 200, message: 'Jogo deletado com sucesso', deletedGame };
    } catch (error) {
        console.error('Erro ao deletar jogo:', error);
        throw new Error('Erro ao deletar jogo');
    }
}

const getGamesByGenre = async (genre) => {
    try {
        const games = await prisma.game.findMany({
            where: {
                genres: {
                    contains: genre
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                backgroundImage: true,
                releaseDate: true,
                playtime: true,
                platforms: true,
                genres: true,
                publishers: true,
                metacriticScore: true,
                screenshots: true,
                createdAt: true,
            }
        });
        
        // Formatar os jogos para retorno (converter strings em arrays)
        const formattedGames = games.map(formatGameForResponse);
        
        return { status: 200, games: formattedGames };
    } catch (error) {
        console.error('Erro ao buscar jogos por gênero:', error);
        throw new Error('Erro ao buscar jogos por gênero');
    }
}

const getAllGames = async () => {
    try {
        const games = await prisma.game.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                backgroundImage: true,
                releaseDate: true,
                playtime: true,
                platforms: true,
                genres: true,
                publishers: true,
                metacriticScore: true,
                screenshots: true,
                createdAt: true,
            }
        });
        
        // Formatar os jogos para retorno (converter strings em arrays)
        const formattedGames = games.map(formatGameForResponse);
        
        return { status: 200, games: formattedGames };
    } catch (error) {
        console.error('Erro ao buscar jogos:', error);
        throw new Error('Erro ao buscar jogos');
    }
}

const loadGamesFromJson = async (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const games = JSON.parse(data);
        
        let successCount = 0;
        let duplicateCount = 0;
        let errorCount = 0;

        for (const game of games) {
            try {
                const result = await createGame({
                    name: game.name,
                    description: game.description,
                    backgroundImage: game.background_image,
                    releaseDate: new Date(game.released),
                    playtime: game.playtime,
                    platforms: game.platforms,
                    genres: game.genres,
                    publishers: game.publishers,
                    metacriticScore: game.metacritic,
                    screenshots: game.screenshots
                });
                
                if (result.status === 200) {
                    successCount++;
                } else if (result.status === 409) {
                    duplicateCount++;
                } else {
                    console.error(`Erro inesperado ao carregar jogo "${game.name}":`, result.message);
                    errorCount++;
                }
            } catch (error) {
                console.error(`Erro ao carregar jogo "${game.name}":`, error);
                errorCount++;
            }
        }
        
        console.log(`Carregamento concluído: ${successCount} novos jogos, ${duplicateCount} já existentes, ${errorCount} erros`);
        return { successCount, duplicateCount, errorCount };
    } catch (error) {
        console.error('Erro ao ler arquivo JSON:', error);
        throw error;
    }
};

module.exports = {
    createGame,
    getGameById,
    getGameByName,
    updateGame,
    deleteGame,
    getGamesByGenre,
    getAllGames,
    loadGamesFromJson
};