import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeviceRepositoryPostgres {
    async createDevice(deviceData) {
        const { name, description, ownerId, locationName, isActive } = deviceData;
        const device = await prisma.device.create({
            data: {
                name,
                description,
                ownerId,
                locationName,
                isActive
            }
        });
        return device;
    }

    async findById(id) {
        return await prisma.device.findUnique({
            where: { id: id }
        });
    }

    async findAll() {
        return await prisma.device.findMany();
    }

    async updateDevice(id, deviceData) {
        return await prisma.device.update({
            where: { id: id },
            data: deviceData
        });
    }

    async deleteDevice(id) {
        return await prisma.device.delete({
            where: { id: id }
        });
    }

    async updateDeviceActivity(deviceId, isActive) {
        return await prisma.device.update({
            where: { id: deviceId },
            data: { isActive }
        });
    }
}
