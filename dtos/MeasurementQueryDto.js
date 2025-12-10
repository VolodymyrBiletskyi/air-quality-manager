import { z } from "zod";

export const measurementQueryDTO = z.object({
    deviceId: z.string().optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    sort: z.enum(["asc", "desc"]).optional()
});
