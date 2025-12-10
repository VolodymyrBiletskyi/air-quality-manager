import { z } from "zod";

export const measurementPayloadDTO = z.object({
    device_id: z.string(),
    timestamp: z.string().datetime(),
    pm25: z.number(),
    pm10: z.number(),
    co2: z.number(),
    temp: z.number(),
    humidity: z.number(),
    aqi: z.number().nullable().optional(),
    category: z.string().nullable().optional(),
    health_message: z.string().nullable().optional(),
    co2_level: z.string().nullable().optional(),
    co2_message: z.string().nullable().optional()
});
