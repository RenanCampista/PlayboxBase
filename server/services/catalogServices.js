const prisma = require("./prisma.js")


const createCatalog = async (catalogData) => {
    try {
        const { name, userId } = catalogData;

        // Verificar se o catálogo já existe
        const existingCatalog = await prisma.catalog.findFirst({
            where: { name, userId }
        });
        if (existingCatalog) {
            return { status: 400, message: 'Catálogo já existe.' };
        }

        // Criar novo catálogo
        const catalog = await prisma.catalog.create({
            data: {
                name,
                userId
            }
        });

        return { status: 201, catalog };
    } catch (error) {
        console.error('Erro ao criar catálogo:', error);
        throw new Error('Erro ao criar catálogo');
    }
}

const getCatalogById = async (id) => {
    try {
        const catalog = await prisma.catalog.findUnique({
            where: { id },
            include: {
                games: true,
                user: true
            }
        });

        if (!catalog) {
            return { status: 404, message: 'Catálogo não encontrado.' };
        }

        return { status: 200, catalog };
    } catch (error) {
        console.error('Erro ao buscar catálogo:', error);
        throw new Error('Erro ao buscar catálogo');
    }
}

const getCatalogsByUserId = async (userId) => {
    try {
        const catalogs = await prisma.catalog.findMany({
            where: { userId },
            include: {
                games: true
            }
        });

        return { status: 200, catalogs };
    } catch (error) {
        console.error('Erro ao buscar catálogos do usuário:', error);
        throw new Error('Erro ao buscar catálogos do usuário');
    }
}

const addGameToCatalog = async (catalogId, gameId) => {
    try {
        // Verificar se o catálogo existe
        const catalog = await prisma.catalog.findUnique({
            where: { id: catalogId }
        });
        if (!catalog) {
            return { status: 404, message: 'Catálogo não encontrado.' };
        }

        // Verificar se o jogo já está no catálogo
        const existingGame = await prisma.catalog.findFirst({
            where: {
                id: catalogId,
                games: {
                    some: { id: gameId }
                }
            }
        });
        if (existingGame) {
            return { status: 400, message: 'Jogo já está no catálogo.' };
        }

        // Adicionar jogo ao catálogo
        await prisma.catalog.update({
            where: { id: catalogId },
            data: {
                games: {
                    connect: { id: gameId }
                }
            }
        });

        return { status: 200, message: 'Jogo adicionado ao catálogo com sucesso.' };
    } catch (error) {
        console.error('Erro ao adicionar jogo ao catálogo:', error);
        throw new Error('Erro ao adicionar jogo ao catálogo');
    }
}

const removeGameFromCatalog = async (catalogId, gameId) => {
    try {
        // Verificar se o catálogo existe
        const catalog = await prisma.catalog.findUnique({
            where: { id: catalogId }
        });
        if (!catalog) {
            return { status: 404, message: 'Catálogo não encontrado.' };
        }

        // Verificar se o jogo está no catálogo
        const existingGame = await prisma.catalog.findFirst({
            where: {
                id: catalogId,
                games: {
                    some: { id: gameId }
                }
            }
        });
        if (!existingGame) {
            return { status: 400, message: 'Jogo não encontrado no catálogo.' };
        }

        // Remover jogo do catálogo
        await prisma.catalog.update({
            where: { id: catalogId },
            data: {
                games: {
                    disconnect: { id: gameId }
                }
            }
        });

        return { status: 200, message: 'Jogo removido do catálogo com sucesso.' };
    } catch (error) {
        console.error('Erro ao remover jogo do catálogo:', error);
        throw new Error('Erro ao remover jogo do catálogo');
    }
}

const deleteCatalog = async (id) => {
    try {
        const deletedCatalog = await prisma.catalog.delete({
            where: { id }
        });
        return { status: 200, message: 'Catálogo deletado com sucesso', deletedCatalog };
    } catch (error) {
        console.error('Erro ao deletar catálogo:', error);
        throw new Error('Erro ao deletar catálogo');
    }
}

const updateCatalog = async (id, catalogData) => {
    try {
        const { name, userId } = catalogData;

        // Verificar se o catálogo existe
        const existingCatalog = await prisma.catalog.findUnique({
            where: { id }
        });
        if (!existingCatalog) {
            return { status: 404, message: 'Catálogo não encontrado.' };
        }

        // Atualizar catálogo
        const updatedCatalog = await prisma.catalog.update({
            where: { id },
            data: {
                name,
                userId
            }
        });

        return { status: 200, updatedCatalog };
    } catch (error) {
        console.error('Erro ao atualizar catálogo:', error);
        throw new Error('Erro ao atualizar catálogo');
    }
}

const getAllCatalogs = async () => {
    try {
        const catalogs = await prisma.catalog.findMany({
            include: {
                games: true,
                user: true
            }
        });
        return { status: 200, catalogs };
    } catch (error) {
        console.error('Erro ao listar catálogos:', error);
        throw new Error('Erro ao listar catálogos');
    }
}

module.exports = {
    createCatalog,
    getCatalogById,
    getCatalogsByUserId,
    addGameToCatalog,
    removeGameFromCatalog,
    deleteCatalog,
    updateCatalog,
    getAllCatalogs
};