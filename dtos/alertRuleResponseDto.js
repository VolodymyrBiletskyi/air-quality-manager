export class AlertRuleResponseDto {
    constructor(alertRule) {
        this.id = alertRule.id;
        this.userId = alertRule.userId;
        this.deviceId = alertRule.deviceId;
        this.name = alertRule.name;
        this.pm2_5Threshold = alertRule.pm2_5Threshold;
        this.pm10Threshold = alertRule.pm10Threshold;
        this.co2Threshold = alertRule.co2Threshold;
        this.aqiThreshold = alertRule.aqiThreshold;
        this.isActive = alertRule.isActive;
        this.createdAt = alertRule.createdAt;
        this.updatedAt = alertRule.updatedAt;

        if (alertRule.user) {
            this.user = {
                id: alertRule.user.id,
                username: alertRule.user.username
            };
        }

        if (alertRule.device) {
            this.device = {
                id: alertRule.device.id,
                name: alertRule.device.name
            };
        }
    }
}
