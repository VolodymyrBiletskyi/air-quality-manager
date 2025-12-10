export class CreateAlertDto {
    constructor(data) {
        this.alertRuleId = data.alertRuleId;
        this.deviceId = data.deviceId;
        this.message = data.message;

        this.validate();
    }

    validate() {
        if (!this.alertRuleId || this.alertRuleId.trim().length === 0) {
            throw new Error('Alert rule ID is required');
        }
        if (!this.deviceId || this.deviceId.trim().length === 0) {
            throw new Error('Device ID is required');
        }
    }
}
