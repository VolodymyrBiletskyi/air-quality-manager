import express from "express";
import { MeasurementService } from "../Services/MeasurementService.js";

const measurementService = new MeasurementService();
const measurementRouter = express.Router();

measurementRouter.post("/", async (req, res) => {
    try {
        const saved = await measurementService.createFromPayload(req.body);
        return res.status(201).json({
            message: "Measurement created successfully",
            data: saved
        });
    } catch (error) {
        console.error("Error creating measurement:", error);
        return res.status(400).json({ error: error.message });
    }
});

measurementRouter.get("/", async (req, res) => {
    try {
        const result = await measurementService.list(req.query);
        res.json(result);
    } catch (error) {
        console.error("Error listing measurements:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

measurementRouter.get("/device/:deviceId", async (req, res) => {
    try {
        const items = await measurementService.getByDevice(
            req.params.deviceId,
            req.query
        );
        res.json(items);
    } catch (error) {
        console.error("Error getting device measurements:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

measurementRouter.get("/device/:deviceId/latest", async (req, res) => {
    try {
        const latest = await measurementService.getLatest(req.params.deviceId);
        if (!latest) {
            return res.status(404).json({ error: "No measurements found for this device" });
        }
        res.json(latest);
    } catch (error) {
        console.error("Error getting latest measurement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

measurementRouter.get("/device/:deviceId/summary", async (req, res) => {
    try {
        const { agg, count } = await measurementService.getSummary(
            req.params.deviceId,
            req.query
        );

        res.json({
            deviceId: req.params.deviceId,
            count,
            range: {
                actualFrom: agg._min.timestamp,
                actualTo: agg._max.timestamp
            },
            aqi: {
                min: agg._min.aqi,
                max: agg._max.aqi,
                avg: agg._avg.aqi
            },
            pm25: {
                min: agg._min.pm2_5,
                max: agg._max.pm2_5,
                avg: agg._avg.pm2_5
            },
            pm10: {
                min: agg._min.pm10,
                max: agg._max.pm10,
                avg: agg._avg.pm10
            },
            co2: {
                min: agg._min.co2,
                max: agg._max.co2,
                avg: agg._avg.co2
            }
        });
    } catch (error) {
        console.error("Error getting summary:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

measurementRouter.get("/:id", async (req, res) => {
    try {
        const measurement = await measurementService.getById(req.params.id);
        if (!measurement) {
            return res.status(404).json({ error: "Measurement not found" });
        }
        res.json(measurement);
    } catch (error) {
        console.error("Error getting measurement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

measurementRouter.put("/:id", async (req, res) => {
    try {
        const updated = await measurementService.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: "Measurement not found" });
        }
        res.json({
            message: "Measurement updated successfully",
            data: updated
        });
    } catch (error) {
        console.error("Error updating measurement:", error);
        res.status(400).json({ error: error.message });
    }
});

measurementRouter.delete("/:id", async (req, res) => {
    try {
        const deleted = await measurementService.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Measurement not found" });
        }

        return res.status(200).json({
            message: "Measurement deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting measurement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default measurementRouter;
