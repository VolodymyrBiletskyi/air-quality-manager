import { AlertRepository } from '../Repositories/AlertRepository.js';
import { CreateAlertDto } from '../dtos/createAlertDto.js';
import { UpdateAlertDto } from '../dtos/updateAlertDto.js';
import { AlertResponseDto } from '../dtos/alertResponseDto.js';

const alertRepository = new AlertRepository();

export class AlertService {
    async createAlert(alertData) {
        const createAlertDto = new CreateAlertDto(alertData);
        const alert = await alertRepository.createAlert(createAlertDto);
        return new AlertResponseDto(alert);
    }

    async getAlertById(id) {
        const alert = await alertRepository.findById(id);
        if (!alert) {
            throw new Error('Alert not found');
        }
        return new AlertResponseDto(alert);
    }

    async getAllAlerts(filters = {}) {
        const alerts = await alertRepository.findAll(filters);
        return alerts.map(alert => new AlertResponseDto(alert));
    }

    async updateAlert(id, alertData) {
        const existingAlert = await alertRepository.findById(id);
        if (!existingAlert) {
            throw new Error('Alert not found');
        }

        const updateAlertDto = new UpdateAlertDto(alertData);
        const updatedAlert = await alertRepository.updateAlert(id, updateAlertDto);
        return new AlertResponseDto(updatedAlert);
    }

    async deleteAlert(id) {
        const existingAlert = await alertRepository.findById(id);
        if (!existingAlert) {
            throw new Error('Alert not found');
        }

        await alertRepository.deleteAlert(id);
        return { message: 'Alert deleted successfully' };
    }
}
