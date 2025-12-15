import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export class MeasurementRepository {
    async createFromPayload(payload) {
        const {
            device_id,
            timestamp,
            pm25,
            pm10,
            co2,
            temp,
            humidity,
            aqi,
            category,
            health_message
        } = payload;

        return prisma.measurement.create({
            data: {
                deviceId: device_id,
                timestamp: new Date(timestamp),
                pm2_5: pm25,
                pm10,
                co2,
                temperature: temp,
                humidity,
                aqi: aqi ?? null,
                category: category ?? null,
                healthMessage: health_message ?? null
            }
        });
    }

    async findById(id) {
        return prisma.measurement.findUnique({
            where: { id: Number(id) }
        });
    }

    async findMany({ deviceId, from, to, page, limit, sort }) {
        const where = {};
        if (deviceId) where.deviceId = deviceId;
        if (from || to) {
            where.timestamp = {};
            if (from) where.timestamp.gte = new Date(from);
            if (to) where.timestamp.lte = new Date(to);
        }

        const take = limit ?? 50;
        const skip = page && page > 1 ? (page - 1) * take : 0;

        const orderBy = { timestamp: sort === "asc" ? "asc" : "desc" };

        const [items, total] = await Promise.all([
            prisma.measurement.findMany({
                where,
                orderBy,
                skip,
                take
            }),
            prisma.measurement.count({ where })
        ]);

        return { items, total, page, limit: take };
    }

    async findByDevice(deviceId, { from, to, limit, sort }) {
        const where = { deviceId };

        if (from || to) {
            where.timestamp = {};
            if (from) where.timestamp.gte = new Date(from);
            if (to) where.timestamp.lte = new Date(to);
        }

        return prisma.measurement.findMany({
            where,
            orderBy: { timestamp: sort === "asc" ? "asc" : "desc" },
            take: limit ?? 100
        });
    }

    async findLatestByDevice(deviceId) {
        return prisma.measurement.findFirst({
            where: { deviceId },
            orderBy: { timestamp: "desc" }
        });
    }

    async getSummaryByDevice(deviceId, { from, to }) {
        const where = { deviceId };

        if (from || to) {
            where.timestamp = {};
            if (from) where.timestamp.gte = new Date(from);
            if (to) where.timestamp.lte = new Date(to);
        }

        const [agg, count] = await Promise.all([
            prisma.measurement.aggregate({
                where,
                _avg: {
                    aqi: true,
                    pm2_5: true,
                    pm10: true,
                    co2: true
                },
                _min: {
                    aqi: true,
                    pm2_5: true,
                    pm10: true,
                    co2: true,
                    timestamp: true
                },
                _max: {
                    aqi: true,
                    pm2_5: true,
                    pm10: true,
                    co2: true,
                    timestamp: true
                }
            }),
            prisma.measurement.count({ where })
        ]);

        return { agg, count };
    }

    async update(id, data) {
        return prisma.measurement.update({
            where: { id: Number(id) },
            data: {
                ...(data.timestamp && { timestamp: new Date(data.timestamp) }),
                ...(data.pm25 !== undefined && { pm2_5: data.pm25 }),
                ...(data.pm10 !== undefined && { pm10: data.pm10 }),
                ...(data.co2 !== undefined && { co2: data.co2 }),
                ...(data.temp !== undefined && { temperature: data.temp }),
                ...(data.humidity !== undefined && { humidity: data.humidity }),
                ...(data.aqi !== undefined && { aqi: data.aqi }),
                ...(data.category !== undefined && { category: data.category }),
                ...(data.health_message !== undefined && { healthMessage: data.health_message })
            }
        });
    }

    async delete(id) {
        try {
            return await prisma.measurement.delete({
                where: { id: id }
            });
        } catch (err) {
            if (err.code === "P2025") {
                return null;
            }
            throw err;
        }
    }
}
