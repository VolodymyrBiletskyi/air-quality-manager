export class AlertResponseDto {
    constructor(alert) {
        this.id = alert.id;
        this.alertRuleId = alert.alertRuleId;
        this.deviceId = alert.deviceId;
        this.triggeredAt = alert.triggeredAt;
        this.message = alert.message;
        this.isRead = alert.isRead;

        if (alert.alertRule) {
            this.alertRule = {
                id: alert.alertRule.id,
                name: alert.alertRule.name
            };
        }

        if (alert.device) {
            this.device = {
                id: alert.device.id,
                name: alert.device.name
            };
        }
    }
}
