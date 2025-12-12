export function toAlertByDeviceDto(alert) {
    return {
        id: alert.id,
        deviceId: alert.deviceId,
        alertRuleId: alert.alertRuleId,

        message: alert.message ?? null,
        isRead: alert.isRead,

        triggeredAt: alert.triggeredAt ? alert.triggeredAt.toISOString() : null,

        // опционально: часть данных правила
        alertRule: alert.alertRule
            ? {
                id: alert.alertRule.id,
                name: alert.alertRule.name,
                isActive: alert.alertRule.isActive,
            }
            : undefined,
    };
}
