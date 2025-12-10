import express from 'express';
import { DeviceService } from '../Services/DeviceService.js';

const deviceService = new DeviceService();
const deviceRouter = express.Router();

deviceRouter.post('/', async (req, res) => {
    try {
        const device = await deviceService.createDevice(req.body);
        res.status(201).json(device);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

deviceRouter.get('/', async (req, res) => {
    try {
        const devices = await deviceService.getAllDevices();
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

deviceRouter.get('/:id', async (req, res) => {
    try {
        const device = await deviceService.getDeviceById(req.params.id);
        res.status(200).json(device);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

deviceRouter.put('/:id', async (req, res) => {
    try {
        const device = await deviceService.updateDevice(req.params.id, req.body);
        res.status(200).json(device);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

deviceRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await deviceService.deleteDevice(id);

        return res.status(200).json({
            message: "Device deleted (cascade removed measurements/alerts)",
        });
    } catch (error) {
        console.error("Error deleting device:", error);

        if (error.code === "P2025") {
            return res.status(404).json({ error: "Device not found" });
        }

        if (error.code === "P2003") {
            return res.status(400).json({
                error: "Foreign key constraint failed",
                constraint: error.meta?.constraint,
            });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
});



deviceRouter.post('/:id/switch', async (req, res) => {
    try {
        const result = await deviceService.deviceSwitch(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


export default deviceRouter;
