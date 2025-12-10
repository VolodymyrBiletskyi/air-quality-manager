export class UpdateDeviceDto {
    constructor(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.description !== undefined) this.description = data.description;
        if (data.locationName !== undefined) this.locationName = data.locationName;
        if (data.isActive !== undefined) this.isActive = data.isActive;

        this.validate();
    }

    validate() {
        if (this.name !== undefined && this.name.trim().length === 0) {
            throw new Error('Device name cannot be empty');
        }
        if (this.location !== undefined && this.location.trim().length === 0) {
            throw new Error('Device location cannot be empty');
        }
    }
}
