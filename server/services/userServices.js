import prisma from "./prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const createUser = async (userData) => {
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