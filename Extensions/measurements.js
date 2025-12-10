import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export async function saveMeasurementsFromPayload(payload) {
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

    const device = await prisma.device.findUnique({
        where: {id: device_id},
    });

    if (!device) {
        throw new Error("Device not found.");
    }


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

    return saved;
}