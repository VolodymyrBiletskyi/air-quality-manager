import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
    async createUser(userData) {
        const { username, passwordHash, email } = userData;
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            }
        });
        return user;
    }

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async findAll() {
        return await prisma.user.findMany();
    }

    async findById(id) {
        return await prisma.user.findUnique({
            where: { id: id }
        });
    }

    async updateUser(id, userData) {
        return await prisma.user.update({
            where: { id: id },
            data: userData
        });
    }

    async deleteUser(id) {
        return await prisma.user.delete({
            where: { id: id }
        });
    }
}
