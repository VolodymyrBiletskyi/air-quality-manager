import express from 'express';
import { AlertRuleService } from '../Services/AlertRuleService.js';
import {authMiddleware} from "../Middleware/AuthMiddleware.js";

const alertRuleService = new AlertRuleService();
const alertRuleRouter = express.Router();

alertRuleRouter.post('/', async (req, res) => {
    try {
        const alertRule = await alertRuleService.createAlertRule(req.body);
        res.status(201).json(alertRule);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

alertRuleRouter.get('/', async (req, res) => {
    try {
        const filters = {
            userId: req.query.userId,
            deviceId: req.query.deviceId,
            isActive: req.query.isActive
        };
        const alertRules = await alertRuleService.getAllAlertRules(filters);
        res.status(200).json(alertRules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

alertRuleRouter.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const alertRules = await alertRuleService.getAllAlertRulesbyUser(userId);
        return res.status(200).json(alertRules);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

alertRuleRouter.get('/:id', async (req, res) => {
    try {
        const alertRule = await alertRuleService.getAlertRuleById(req.params.id);
        res.status(200).json(alertRule);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

alertRuleRouter.put('/:id', async (req, res) => {
    try {
        const alertRule = await alertRuleService.updateAlertRule(req.params.id, req.body);
        res.status(200).json(alertRule);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

alertRuleRouter.delete('/:id', async (req, res) => {
    try {
        const result = await alertRuleService.deleteAlertRule(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default alertRuleRouter;
