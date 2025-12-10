import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AlertRuleRepository {
    async create(alertRuleData) {
        return await prisma.alertRule.create({
            data: alertRuleData,
            include: {
                user: true,
                device: true
            }
        });
    }

    async findById(id) {
        return await prisma.alertRule.findUnique({
            where: { id },
            include: {
                user: true,
                device: true
            }
        });
    }

    async findAll(filters = {}) {
        const where = {};

        if (filters.userId) {
            where.userId = filters.userId;
        }

        if (filters.deviceId) {
            where.deviceId = filters.deviceId;
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive === 'true' || filters.isActive === true;
        }

        return await prisma.alertRule.findMany({
            where,
            include: {
                user: true,
                device: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async update(id, alertRuleData) {
        return await prisma.alertRule.update({
            where: { id },
            data: alertRuleData,
            include: {
                user: true,
                device: true
            }
        });
    }

    async delete(id) {
        return await prisma.alertRule.delete({
            where: { id }
        });
    }
}
