import { z } from "zod";

export const measurementUpdateDto = z.object({
    timestamp: z.string().datetime().optional(),
    pm25: z.number().optional(),
    pm10: z.number().optional(),
    co2: z.number().optional(),
    temp: z.number().optional(),
    humidity: z.number().optional(),
    aqi: z.number().nullable().optional(),
    category: z.string().nullable().optional(),
    health_message: z.string().nullable().optional()
});
