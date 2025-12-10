import { AlertRuleRepository } from '../Repositories/AlertRuleRepository.js';
import { CreateAlertRuleDto } from '../dtos/createAlertRuleDto.js';
import { UpdateAlertRuleDto } from '../dtos/updateAlertRuleDto.js';
import { AlertRuleResponseDto } from '../dtos/alertRuleResponseDto.js';

const alertRuleRepository = new AlertRuleRepository();

export class AlertRuleService {
    async createAlertRule(alertRuleData) {
        const createAlertRuleDto = new CreateAlertRuleDto(alertRuleData);
        const alertRule = await alertRuleRepository.create(createAlertRuleDto);
        return new AlertRuleResponseDto(alertRule);
    }

    async getAlertRuleById(id) {
        const alertRule = await alertRuleRepository.findById(id);
        if (!alertRule) {
            throw new Error('Alert rule not found');
        }
        return new AlertRuleResponseDto(alertRule);
    }

    async getAllAlertRules(filters) {
        const alertRules = await alertRuleRepository.findAll(filters);
        return alertRules.map(rule => new AlertRuleResponseDto(rule));
    }

    async updateAlertRule(id, alertRuleData) {
        const existingAlertRule = await alertRuleRepository.findById(id);
        if (!existingAlertRule) {
            throw new Error('Alert rule not found');
        }

        const updateAlertRuleDto = new UpdateAlertRuleDto(alertRuleData);
        const updatedAlertRule = await alertRuleRepository.update(id, updateAlertRuleDto);
        return new AlertRuleResponseDto(updatedAlertRule);
    }

    async deleteAlertRule(id) {
        const existingAlertRule = await alertRuleRepository.findById(id);
        if (!existingAlertRule) {
            throw new Error('Alert rule not found');
        }

        await alertRuleRepository.delete(id);
        return { message: 'Alert rule deleted successfully' };
    }
}
