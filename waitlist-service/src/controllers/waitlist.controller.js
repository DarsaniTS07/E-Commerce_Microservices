const { asyncHandler } = require("../utils/asyncHandler");

class WaitlistController {
  constructor(waitlistService) {
    this.waitlistService = waitlistService;
  }

  joinWaitlist = asyncHandler(async (req, res) => {
    const data = await this.waitlistService.joinWaitlist({
      ...req.body,
      userId: req.user?.id || req.body.userId,
    });
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

 getPosition = asyncHandler(async (req, res) => {
  const data = await this.waitlistService.getPosition({
    eventId: req.query.eventId,
    userId: req.user.id,
  });

  res.json({
    success: true,
    message: "Operation successful",
    data,
  });
});

  getUserWaitlists = asyncHandler(async (req, res) => {
    const data = await this.waitlistService.getUserWaitlists(req.user.id);
    res.json({ success: true, message: 'Operation successful', data });
  });

  leaveWaitlist = asyncHandler(async (req, res) => {
    const data = await this.waitlistService.leaveWaitlist(req.body.waitlistId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  processWaitlist = asyncHandler(async (req, res) => {
    const data = await this.waitlistService.processWaitlist(req.body.eventId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { WaitlistController };
