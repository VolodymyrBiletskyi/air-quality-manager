import express from 'express';
import { AlertService } from '../Services/AlertService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const alertService = new AlertService();
const alertRouter = express.Router();

alertRouter.post('/', async (req, res) => {
    try {
        const alert = await alertService.createAlert(req.body);
        res.status(201).json(alert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

alertRouter.get('/', async (req, res) => {
    try {
        const { deviceId, isRead } = req.query;
        const alerts = await alertService.getAllAlerts({ deviceId, isRead });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

alertRouter.get('/:id', async (req, res) => {
    try {
        const alert = await alertService.getAlertById(req.params.id);
        res.status(200).json(alert);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

alertRouter.put('/:id', async (req, res) => {
    try {
        const alert = await alertService.updateAlert(req.params.id, req.body);
        res.status(200).json(alert);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

alertRouter.delete('/:id', async (req, res) => {
    try {
        const result = await alertService.deleteAlert(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

alertRouter.get('/device/:deviceId', authMiddleware, async (req, res) => {
    try {
        const { deviceId } = req.params;

        const alerts = await alertService.getAlertsByDeviceIdForUser(deviceId, req.user.id);

        return res.status(200).json(alerts);
    } catch (err) {
        console.error('Error fetching alerts:', err);

        return res.status(err.status || 500).json({
            message: err.message || 'Internal server error',
            details: err.details || undefined,
        });
    }
});

export default alertRouter;
