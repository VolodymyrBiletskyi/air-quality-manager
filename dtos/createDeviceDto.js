export class CreateDeviceDto {
    constructor(data) {
        this.name = data.name;
        this.description = data.description;
        this.ownerId = data.ownerId;
        this.locationName = data.locationName;
        this.isActive = data.isActive !== undefined ? data.isActive : true;

        this.validate();
    }

    validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error('Device name is required');
        }
        if (!this.ownerId || this.ownerId.trim().length === 0) {
            throw new Error('Owner ID is required');
        }
    }
}
