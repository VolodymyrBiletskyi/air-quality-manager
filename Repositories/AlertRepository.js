import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AlertRepository {
    async createAlert(alertData) {
        const { alertRuleId, deviceId, message } = alertData;
        return await prisma.alert.create({
            data: {
                alertRuleId,
                deviceId,
                message,
                isRead: false
            },
            include: {
                alertRule: true,
                device: true
            }
        });
    }

    async findById(id) {
        return await prisma.alert.findUnique({
            where: { id },
            include: {
                alertRule: true,
                device: true
            }
        });
    }

    async findAll(filters = {}) {
        const where = {};

        if (filters.deviceId) {
            where.deviceId = filters.deviceId;
        }

        if (filters.isRead !== undefined) {
            where.isRead = filters.isRead === 'true';
        }

        return await prisma.alert.findMany({
            where,
            include: {
                alertRule: true,
                device: true
            },
            orderBy: {
                triggeredAt: 'desc'
            }
        });
    }

    async updateAlert(id, alertData) {
        return await prisma.alert.update({
            where: { id },
            data: alertData,
            include: {
                alertRule: true,
                device: true
            }
        });
    }

    async deleteAlert(id) {
        return await prisma.alert.delete({
            where: { id }
        });
    }
}
