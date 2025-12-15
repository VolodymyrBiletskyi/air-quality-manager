import { MeasurementRepository } from "../Repositories/MeasurementRepository.js";
import { measurementPayloadDTO } from "../dtos/MeasurementPayloadDto.js";
import { measurementQueryDTO } from "../dtos/MeasurementQueryDto.js";
import { measurementUpdateDto } from "../dtos/measurementUpdateDto.js";

export class MeasurementService {
    constructor() {
        this.repo = new MeasurementRepository();
    }

    async createFromPayload(payload) {
        const validated = measurementPayloadDTO.parse(payload);
        return this.repo.createFromPayload(validated);
    }

    async list(query) {
        const validated = measurementQueryDTO.parse(query);
        return this.repo.findMany(validated);
    }

    async getById(id) {
        return this.repo.findById(id);
    }

    async getByDevice(deviceId, query) {
        const validated = measurementQueryDTO.parse(query);
        return this.repo.findByDevice(deviceId, validated);
    }

    async getLatest(deviceId) {
        return this.repo.findLatestByDevice(deviceId);
    }

    async getSummary(deviceId, query) {
        const validated = measurementQueryDTO.parse(query);
        return this.repo.getSummaryByDevice(deviceId, validated);
    }

    async update(id, payload) {
        const validated = measurementUpdateDto.parse(payload);
        return this.repo.update(id, validated);
    }

    async delete(id) {
        return this.repo.delete(id);
    }
}
