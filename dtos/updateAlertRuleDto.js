export class UpdateAlertRuleDto {
    constructor(data) {
        if (data.name !== undefined) this.name = data.name;
        if (data.deviceId !== undefined) this.deviceId = data.deviceId;
        if (data.pm2_5Threshold !== undefined) this.pm2_5Threshold = data.pm2_5Threshold;
        if (data.pm10Threshold !== undefined) this.pm10Threshold = data.pm10Threshold;
        if (data.co2Threshold !== undefined) this.co2Threshold = data.co2Threshold;
        if (data.aqiThreshold !== undefined) this.aqiThreshold = data.aqiThreshold;
        if (data.isActive !== undefined) this.isActive = data.isActive;

        this.validate();
    }

    validate() {
        if (this.name !== undefined && this.name.trim().length === 0) {
            throw new Error('Alert rule name cannot be empty');
        }
    }
}
