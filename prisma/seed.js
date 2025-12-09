import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            username: 'testuser',
            email: 'test@example.com',
            passwordHash: 'dummy-hash',
            role: 'USER'
        }
    });

    await prisma.device.upsert({
        where: { id: 'sensor-001' },
        update: {},
        create: {
            id: 'sensor-001',
            name: 'Air Quality Sensor 001',
            description: 'Test device for simulator',
            ownerId: user.id,
            locationName: 'Test Location',
            isActive: true
        }
    });

    console.log('Seed data created');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
