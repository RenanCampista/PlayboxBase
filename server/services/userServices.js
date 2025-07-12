const prisma = require("./prisma.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta';

const createUser = async (userData) => {
    try {
        const { name, email, password } = userData;

        if (!name || !email || !password) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        // O número 10 significa o custo de hashing, quanto maior, mais seguro, mas mais lento.
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isAdmin: false // Setado para false por padrão
            },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true
            }
        });
        
        return { status: 201, message: "Usuário criado com sucesso.", user };
    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            if (field === 'name') {
                throw new Error("Nome de usuário já está em uso.");
            } else if (field === 'email') {
                throw new Error("Email já está em uso.");
            } else {
                throw new Error("Erro ao criar usuário: " + error.message);
            }
        } else {
            console.error('Erro ao criar usuário:', error);
            throw new Error("Erro ao criar usuário: " + error.message);
        }
    }
}

const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true
            }
        });
        return { status: 200, users };
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error("Erro ao buscar usuários: " + error.message);
    }
}

const getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        return { status: 200, user };
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw new Error("Erro ao buscar usuário: " + error.message);
    }
}

const updateUser = async (userId, userData) => {
    try {
        const { name, email, password, isAdmin } = userData;

        if (!name || !email) {
            throw new Error("Nome e email são obrigatórios.");
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const updatedData = {
            name,
            email,
            isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin // Mantém o valor atual se não for fornecido
        };

        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData,
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true
            }
        });

        return { status: 200, message: "Usuário atualizado com sucesso.", user: updatedUser };
    } catch (error) {
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            if (field === 'name') {
                throw new Error("Nome de usuário já está em uso.");
            } else if (field === 'email') {
                throw new Error("Email já está em uso.");
            } else {
                throw new Error("Erro ao atualizar usuário: " + error.message);
            }
        }
        console.error('Erro ao atualizar usuário:', error);
        throw new Error("Erro ao atualizar usuário: " + error.message);
    }
}

const deleteUser = async (userId) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        return { status: 200, message: "Usuário deletado com sucesso." };
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error("Usuário não encontrado.");
        }
        console.error('Erro ao deletar usuário:', error);
        throw new Error("Erro ao deletar usuário: " + error.message);
    }
}

const authenticateUser = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Senha incorreta.");
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { status: 200, message: "Autenticação bem-sucedida.", token, user };
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        throw new Error("Erro ao autenticar usuário: " + error.message);
    }
}

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { status: 200, userId: decoded.id, isAdmin: decoded.isAdmin };
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        throw new Error("Token inválido ou expirado.");
    }
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido." });
        }
        req.user = user;
        next();
    });
}

const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new Error("Senha atual incorreta.");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        return { status: 200, message: "Senha alterada com sucesso!" };
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        throw new Error(error.message);
    }
};

const requestPasswordReset = async (email, jwtSecret) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return { status: 200, message: "Se o email existir no sistema, você receberá instruções para redefinir sua senha." };
        }

        const resetToken = jwt.sign(
            { userId: user.id, email: user.email, type: 'password-reset' },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return {
            status: 200,
            message: "Token de recuperação gerado com sucesso!",
            resetToken // ⚠️ Em produção, remova esta linha e envie o token por email
        };
    } catch (error) {
        console.error('Erro ao solicitar recuperação de senha:', error);
        throw new Error("Erro ao solicitar recuperação de senha.");
    }
};

const resetPassword = async (token, newPassword, jwtSecret) => {
    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (decoded.type !== 'password-reset') {
            throw new Error("Tipo de token inválido.");
        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword }
        });

        return { status: 200, message: "Senha redefinida com sucesso!" };
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        throw new Error(error.message);
    }
};

const createFirstAdmin = async (adminData) => {
    try {
        const existingAdmin = await prisma.user.findFirst({ where: { isAdmin: true } });

        if (existingAdmin) {
            throw new Error("Já existe um administrador no sistema.");
        }

        const { name, email, password } = adminData;

        if (!name || !email || !password) {
            throw new Error("Nome, email e senha são obrigatórios.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isAdmin: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true
            }
        });

        return { status: 201, message: "Primeiro administrador criado com sucesso!", user: admin };
    } catch (error) {
        console.error('Erro ao criar administrador:', error);
        throw new Error(error.message);
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar.' });
    }
    next();
};

// Exportando os serviços. Isso faz com que esses métodos possam ser usados em outros arquivos.
module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    authenticateUser,
    verifyToken,
    authenticateToken,
    changePassword,
    requestPasswordReset,
    resetPassword,
    createFirstAdmin,
    requireAdmin
};