import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient

export const addMeasurement = async (req, res) => {
    try {
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
        } = req.body;

        const device = await prisma.device.findUnique({
            where: { id: device_id },
        });

        if (!device)
            return res.status(404).json({ error: "Device not found" });

        const saved = await prisma.measurement.create({
            data: {
                deviceId: device_id,
                timestamp: new Date(timestamp),
                pm2_5: pm25,
                pm10: pm10,
                co2: co2,
                temperature: temp,
                humidity: humidity,
                aqi: aqi ?? null,
                category: category ?? null,
                healthMessage: health_message ?? null
            },
        });

        return res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
