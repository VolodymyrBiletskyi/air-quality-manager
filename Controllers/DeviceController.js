import express from 'express';
import { DeviceService } from '../Services/DeviceService.js';
import { authMiddleware } from '../Middleware/AuthMiddleware.js';

const deviceService = new DeviceService();
const deviceRouter = express.Router();

deviceRouter.post('/', authMiddleware, async (req, res) => {
    try {
        const deviceData = {
            ...req.body,
            ownerId: req.user.id,
        };

        const device = await deviceService.createDevice(deviceData);
        return res.status(201).json(device);
    } catch (error) {
        console.error('Error creating device:', error);

        if (error.message === 'Validation error' && Array.isArray(error.details)) {
            return res.status(400).json({
                message: error.message,
                errors: error.details,
            });
        }

        return res.status(400).json({ error: error.message });
    }
});

deviceRouter.get('/all', async (req, res) => {
    try {
        const devices = await deviceService.getAllDevices();
        return res.status(200).json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        return res.status(500).json({ error: error.message });
    }
});

deviceRouter.get('/user-devices', authMiddleware, async (req, res) => {
    try {
        const devices = await deviceService.getAllDevices();
        return res.status(200).json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        return res.status(500).json({ error: error.message });
    }
});

deviceRouter.get('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    try {
        const device = await deviceService.getDeviceById(id);

        return res.status(200).json(device);
    } catch (error) {
        console.error('Error fetching device:', error);

        if (error.message === 'Device not found') {
            return res.status(404).json({ error: error.message });
        }

        return res.status(500).json({ error: error.message });
    }
});

deviceRouter.patch('/patch/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    try {
        const device = await deviceService.updateDevice(id, req.body);
        return res.status(200).json(device);
    } catch (error) {
        console.error('Error updating device:', error);

        if (error.message === 'Device not found') {
            return res.status(404).json({ error: error.message });
        }

        if (error.message === 'Validation error' && Array.isArray(error.details)) {
            return res.status(400).json({
                message: error.message,
                errors: error.details,
            });
        }

        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Device not found' });
        }

        return res.status(400).json({ error: error.message });
    }
});


deviceRouter.delete('/:id', authMiddleware, async (req, res) => {
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

export default deviceRouter;
