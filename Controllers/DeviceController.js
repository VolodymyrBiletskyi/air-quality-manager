import express from 'express';
import { DeviceService } from '../Services/DeviceService.js';

const deviceService = new DeviceService();

export class DeviceController {
    async createDevice(req, res) {
        try {
            const device = await deviceService.createDevice(req.body);
            res.status(201).json(device);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getDeviceById(req, res) {
        try {
            const device = await deviceService.getDeviceById(req.params.id);
            res.status(200).json(device);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getAllDevices(req, res) {
        try {
            const devices = await deviceService.getAllDevices();
            res.status(200).json(devices);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateDevice(req, res) {
        try {
            const device = await deviceService.updateDevice(req.params.id, req.body);
            res.status(200).json(device);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async deleteDevice(req, res) {
        try {
            const result = await deviceService.deleteDevice(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

const deviceRouter = express.Router();
const deviceController = new DeviceController();

deviceRouter.post('/', (req, res) => deviceController.createDevice(req, res));
deviceRouter.get('/', (req, res) => deviceController.getAllDevices(req, res)); // This first
deviceRouter.get('/:id', (req, res) => deviceController.getDeviceById(req, res)); // This second
deviceRouter.put('/:id', (req, res) => deviceController.updateDevice(req, res));
deviceRouter.delete('/:id', (req, res) => deviceController.deleteDevice(req, res));

export default deviceRouter;