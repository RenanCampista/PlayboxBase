const prisma = require("./prisma.js")

const createReview = async (reviewData) => {
    try {
        const { gameId, userId, rating, comment } = reviewData;

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
                rating,
                comment
            }
        });

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
        const { rating, comment } = reviewData;

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
                rating,
                comment
            }
        });

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

        // Deletar avaliação
        await prisma.review.delete({
            where: { id: reviewId }
        });

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

module.exports = {
    createReview,
    getReviewById,
    getReviewsByGameId,
    updateReview,
    deleteReview,
    getReviewsByUserId
};