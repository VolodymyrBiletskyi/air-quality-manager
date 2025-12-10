import express from "express";
import { saveMeasurementsFromPayload } from "../Extensions/measurements.js";

const measurementRouter = express.Router();

// POST /api/measurements
measurementRouter.post("/", async (req, res) => {
    try {
        const saved = await saveMeasurementsFromPayload(req.body);

        return res.status(201).json({
            message: "Measurement saved successfully",
            data: saved,
        });
    } catch (error) {
        console.error("Error saving measurement:", error);

        if (error.message === "Device not found.") {
            return res.status(404).json({ error: "Device not found" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
});

export default measurementRouter;
