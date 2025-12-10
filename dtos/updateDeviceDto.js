export class UpdateDeviceDto {
    constructor(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.location !== undefined) this.location = data.location;
        if (data.status !== undefined) this.status = data.status;

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
