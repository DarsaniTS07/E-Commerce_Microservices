const { NotificationRepository } = require("./repositories/notification.repository");
const { NotificationService } = require("./services/notification.service");

function createNotificationService() {
    const notificationRepository = new NotificationRepository();

    return new NotificationService(notificationRepository);
}

module.exports = {
    createNotificationService,
};