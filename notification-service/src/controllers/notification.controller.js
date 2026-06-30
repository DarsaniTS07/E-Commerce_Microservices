const { asyncHandler } = require('../../utils/asyncHandler');
const { getActorId } = require('../../utils/requestContext');

class NotificationController {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  getNotifications = asyncHandler(async (req, res) => {
    const data = await this.notificationService.getNotifications(getActorId(req, req.query.userId));
    res.json({ success: true, message: 'Operation successful', data });
  });

  markAsRead = asyncHandler(async (req, res) => {
    const data = await this.notificationService.markAsRead(req.params.notificationId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { NotificationController };
