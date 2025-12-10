export class DeviceResponseDto {
    constructor(device) {
        this.id = device.id;
        this.name = device.name;
        this.description = device.description;
        this.ownerId = device.ownerId;
        this.locationName = device.locationName;
        this.isActive = device.isActive;
        this.createdAt = device.createdAt;
        this.updatedAt = device.updatedAt;
    }
}