import { DeviceRepositoryPostgres } from '../Repositories/DeviceRepository.js';
import { CreateDeviceDto } from '../dtos/createDeviceDto.js';
import { UpdateDeviceDto } from '../dtos/updateDeviceDto.js';
import { DeviceResponseDto } from '../dtos/deviceResponseDto.js';

const deviceRepository = new DeviceRepositoryPostgres();

export class DeviceService {
    async createDevice(deviceData) {
        const createDeviceDto = new CreateDeviceDto(deviceData);
        const device = await deviceRepository.createDevice(createDeviceDto);
        return new DeviceResponseDto(device);
    }

    async getDeviceById(id) {
        const device = await deviceRepository.findById(id);
        if (!device) {
            throw new Error('Device not found');
        }
        return new DeviceResponseDto(device);
    }

    async getAllDevices() {
        const devices = await deviceRepository.findAll();
        return devices.map(device => new DeviceResponseDto(device));
    }

    async updateDevice(id, deviceData) {
        const existingDevice = await deviceRepository.findById(id);
        if (!existingDevice) {
            throw new Error('Device not found');
        }

        const updateDeviceDto = new UpdateDeviceDto(deviceData);
        const updatedDevice = await deviceRepository.updateDevice(id, updateDeviceDto);
        return new DeviceResponseDto(updatedDevice);
    }

    async deleteDevice(id) {
        const existingDevice = await deviceRepository.findById(id);
        if (!existingDevice) {
            throw new Error('Device not found');
        }

        await deviceRepository.deleteDevice(id);
        return { message: 'Device deleted successfully' };
    }

    async deviceSwitch(id) {
        const existingDevice = await deviceRepository.findById(id);

        if (!existingDevice) {
            throw new Error('Device not found');
        }

        const newIsActive = !existingDevice.isActive;

        const updatedDevice = await deviceRepository.updateDeviceActivity(id, newIsActive);

        return new DeviceResponseDto(updatedDevice);
    }
}
