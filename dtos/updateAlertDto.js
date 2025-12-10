export class UpdateAlertDto {
    constructor(data) {
        if (data.isRead !== undefined) this.isRead = data.isRead;
        if (data.message !== undefined) this.message = data.message;
    }
}
