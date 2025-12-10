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

deviceRouter.delete('/:id', async (req, res) => {
    try {
        const result = await deviceService.deleteDevice(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
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
