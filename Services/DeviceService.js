import { DeviceRepositoryPostgres } from '../Repositories/DeviceRepository.js';
import { DeviceResponseDto } from '../dtos/deviceResponseDto.js';
import { MqttPublisher } from "../Extensions/MqttPublisher.js";

const deviceRepository = new DeviceRepositoryPostgres();
const mqttPublisher = new MqttPublisher();

export class DeviceService {
    validateCreateDeviceData(deviceData) {
        const errors = [];

        if (!deviceData) {
            errors.push('Device data is required');
        } else {
            const { name, ownerId } = deviceData;

            if (!name || typeof name !== 'string') {
                errors.push('Device name is required and must be a string');
            }

            if (ownerId == null) {
                errors.push('ownerId is required');
            }
        }

        if (errors.length > 0) {
            const error = new Error('Validation error');
            error.details = errors;
            throw error;
        }
    }


    async createDevice(deviceData) {
        this.validateCreateDeviceData(deviceData);

        const device = await deviceRepository.createDevice(deviceData);
        return DeviceResponseDto(device);
    }

    async getDeviceById(id) {
        const device = await deviceRepository.findById(id);

        if (!device) {
            throw new Error('Device not found');
        }

        return DeviceResponseDto(device);
    }

    async getAllDevices() {
        const devices = await deviceRepository.findAll();
        return devices.map(DeviceResponseDto);
    }

    validatePatchDeviceData(deviceData) {
        const errors = [];

        if (!deviceData || typeof deviceData !== 'object') {
            errors.push('Device data must be an object');
        } else {
            const allowed = ['name', 'description', 'locationName', 'isActive'];
            const keys = Object.keys(deviceData);

            if (keys.length === 0) {
                errors.push('At least one field must be provided');
            }

            const unknown = keys.filter(k => !allowed.includes(k));
            if (unknown.length > 0) {
                errors.push(`Unknown fields: ${unknown.join(', ')}`);
            }

            if ('name' in deviceData && typeof deviceData.name !== 'string') {
                errors.push('name must be a string');
            }
            if ('description' in deviceData && typeof deviceData.description !== 'string') {
                errors.push('description must be a string');
            }
            if ('locationName' in deviceData && typeof deviceData.locationName !== 'string') {
                errors.push('locationName must be a string');
            }
            if ('isActive' in deviceData && typeof deviceData.isActive !== 'boolean') {
                errors.push('isActive must be a boolean');
            }

            if (typeof deviceData.name === 'string' && deviceData.name.trim().length === 0) {
                errors.push('Device name cannot be empty');
            }
            if (typeof deviceData.locationName === 'string' && deviceData.locationName.trim().length === 0) {
                errors.push('Device locationName cannot be empty');
            }
        }

        if (errors.length > 0) {
            const error = new Error('Validation error');
            error.details = errors;
            throw error;
        }
    }

    async updateDevice(id, deviceData) {
        const existingDevice = await deviceRepository.findById(id);

        if (!existingDevice) {
            throw new Error('Device not found');
        }

        this.validatePatchDeviceData(deviceData);

        const updateData = { ...deviceData };
        Object.keys(updateData).forEach(k => {
            if (updateData[k] === undefined) delete updateData[k];
        });

        const updatedDevice = await deviceRepository.updateDevice(id, updateData);
        return DeviceResponseDto(updatedDevice);
    }


    async deleteDevice(id) {
        const existingDevice = await deviceRepository.findById(id);

        if (!existingDevice) {
            throw new Error('Device not found');
        }

        await deviceRepository.deleteById(existingDevice.id);

        return { message: 'Device deleted successfully' };
    }

    async deviceSwitch(id) {
        const existingDevice = await deviceRepository.findById(id);

        if (!existingDevice) {
            throw new Error("Device not found");
        }
        const newIsActive = !existingDevice.isActive;

        const updatedDevice = await deviceRepository.updateDeviceActivity(id, newIsActive);

        const commandTopic = `devices/${id}/commands`;
        await mqttPublisher.publish(commandTopic, { action: newIsActive ? "ON" : "OFF" }, { qos: 1, retain: true });


        return DeviceResponseDto(updatedDevice);
    }
}
