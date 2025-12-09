import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepositoryPostgres {
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
}