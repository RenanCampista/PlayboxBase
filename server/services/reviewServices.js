const prisma = require("./prisma.js")

const createReview = async (reviewData) => {
    try {
        const { 
            gameId, 
            userId, 
            gameplayRating, 
            visualRating, 
            audioRating, 
            difficultyRating, 
            immersionRating, 
            historyRating, 
            comment 
        } = reviewData;

        // Validar que todos os ratings estão entre 0 e 5
        const ratings = [gameplayRating, visualRating, audioRating, difficultyRating, immersionRating, historyRating];
        
        for (const rating of ratings) {
            if (rating < 0 || rating > 5 || !Number.isInteger(rating)) {
                return { status: 400, message: 'Todos os ratings devem ser números inteiros entre 0 e 5 estrelas.' };
            }
        }

        // Calcular a média dos ratings (manter como float para precisão)
        const averageRating = (
            gameplayRating + 
            visualRating + 
            audioRating + 
            difficultyRating + 
            immersionRating + 
            historyRating
        ) / 6;

        // Verificar se o jogo existe
        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });
        if (!game) {
            return { status: 404, message: 'Jogo não encontrado.' };
        }

        // Criar nova avaliação
        const review = await prisma.review.create({
            data: {
                gameId,
                userId,
                gameplayRating,
                visualRating,
                audioRating,
                difficultyRating,
                immersionRating,
                historyRating,
                averageRating: parseFloat(averageRating.toFixed(2)),
                comment
            }
        });

        // Atualizar a média de avaliação do jogo
        await updateGameAverageRating(gameId);

        return { status: 201, review };
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        throw new Error('Erro ao criar avaliação');
    }
}

const getReviewById = async (id) => {
    try {
        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                game: true,
                user: true
            }
        });
        if (!review) {
            return { status: 404, message: 'Avaliação não encontrada.' };
        }
        return { status: 200, review };
    } catch (error) {
        console.error('Erro ao buscar avaliação:', error);
        throw new Error('Erro ao buscar avaliação');
    }
}

const getReviewsByGameId = async (gameId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { gameId },
            include: {
                user: true
            }
        });

        if (reviews.length === 0) {
            return { status: 404, message: 'Nenhuma avaliação encontrada para este jogo.' };
        }

        return { status: 200, reviews };
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        throw new Error('Erro ao buscar avaliações');
    }
}

const updateReview = async (reviewId, reviewData) => {
    try {
        const { 
            gameplayRating, 
            visualRating, 
            audioRating, 
            difficultyRating, 
            immersionRating, 
            historyRating, 
            comment 
        } = reviewData;

        // Validar que todos os ratings estão entre 0 e 5
        const ratings = [gameplayRating, visualRating, audioRating, difficultyRating, immersionRating, historyRating];
        
        for (const rating of ratings) {
            if (rating < 0 || rating > 5 || !Number.isInteger(rating)) {
                return { status: 400, message: 'Todos os ratings devem ser números inteiros entre 0 e 5 estrelas.' };
            }
        }

        // Calcular a nova média dos ratings (manter como float para precisão)
        const averageRating = (
            gameplayRating + 
            visualRating + 
            audioRating + 
            difficultyRating + 
            immersionRating + 
            historyRating
        ) / 6;

        // Verificar se a avaliação existe
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!existingReview) {
            return { status: 404, message: 'Avaliação não encontrada.' };
        }

        // Atualizar avaliação
        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                gameplayRating,
                visualRating,
                audioRating,
                difficultyRating,
                immersionRating,
                historyRating,
                averageRating: parseFloat(averageRating.toFixed(2)),
                comment
            }
        });

        // Atualizar a média de avaliação do jogo
        await updateGameAverageRating(existingReview.gameId);

        return { status: 200, updatedReview };
    } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        throw new Error('Erro ao atualizar avaliação');
    }
}

const deleteReview = async (reviewId) => {
    try {
        // Verificar se a avaliação existe
        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!existingReview) {
            return { status: 404, message: 'Avaliação não encontrada.' };
        }

        // Salvar o gameId antes de deletar
        const gameId = existingReview.gameId;

        // Deletar avaliação
        await prisma.review.delete({
            where: { id: reviewId }
        });

        // Atualizar a média de avaliação do jogo
        await updateGameAverageRating(gameId);

        return { status: 200, message: 'Avaliação deletada com sucesso.' };
    } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        throw new Error('Erro ao deletar avaliação');
    }
}

const getReviewsByUserId = async (userId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                game: true
            }
        });

        if (reviews.length === 0) {
            return { status: 404, message: 'Nenhuma avaliação encontrada para este usuário.' };
        }

        return { status: 200, reviews };
    } catch (error) {
        console.error('Erro ao buscar avaliações do usuário:', error);
        throw new Error('Erro ao buscar avaliações do usuário');
    }
}

// Função para atualizar a média de avaliação do jogo
const updateGameAverageRating = async (gameId) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { gameId }
        });

        if (reviews.length === 0) {
            // Se não há reviews, definir como null
            await prisma.game.update({
                where: { id: gameId },
                data: { averageReviewRating: null }
            });
            return;
        }

        // Calcular a média dos averageRating de todas as reviews do jogo
        const totalRating = reviews.reduce((sum, review) => sum + review.averageRating, 0);
        const averageReviewRating = totalRating / reviews.length;

        // Atualizar o jogo com a nova média
        await prisma.game.update({
            where: { id: gameId },
            data: { averageReviewRating: parseFloat(averageReviewRating.toFixed(2)) }
        });
    } catch (error) {
        console.error('Erro ao atualizar média de avaliação do jogo:', error);
        throw new Error('Erro ao atualizar média de avaliação do jogo');
    }
}

module.exports = {
    createReview,
    getReviewById,
    getReviewsByGameId,
    updateReview,
    deleteReview,
    getReviewsByUserId,
    updateGameAverageRating
};