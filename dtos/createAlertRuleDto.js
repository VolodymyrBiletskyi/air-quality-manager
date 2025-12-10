export class CreateAlertRuleDto {
    constructor(data) {
        this.userId = data.userId;
        this.deviceId = data.deviceId || null;
        this.name = data.name;
        this.pm2_5Threshold = data.pm2_5Threshold || null;
        this.pm10Threshold = data.pm10Threshold || null;
        this.co2Threshold = data.co2Threshold || null;
        this.aqiThreshold = data.aqiThreshold || null;
        this.isActive = data.isActive !== undefined ? data.isActive : true;

        this.validate();
    }

    validate() {
        if (!this.userId || this.userId.trim().length === 0) {
            throw new Error('User ID is required');
        }
        if (!this.name || this.name.trim().length === 0) {
            throw new Error('Alert rule name is required');
        }
        if (!this.pm2_5Threshold && !this.pm10Threshold && !this.co2Threshold && !this.aqiThreshold) {
            throw new Error('At least one threshold must be specified');
        }
    }
}
