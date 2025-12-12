export function DeviceResponseDto(device) {
    if (!device) return null;

    return {
        id: device.id,
        name: device.name,
        description: device.description,
        ownerId: device.ownerId,
        locationName: device.locationName,
        isActive: device.isActive,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
    };
}