const { asyncHandler } = require('../utils/asyncHandler');
const { getActorId } = require('../utils/requestContext');

class EventController {
  constructor(eventService) {
    this.eventService = eventService;
  }

  listEvents = asyncHandler(async (req, res) => {
    const data = await this.eventService.listEvents(req.query);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getEventDetails = asyncHandler(async (req, res) => {
    const data = await this.eventService.getEventDetails(req.params.eventId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  createEvent = asyncHandler(async (req, res) => {
    const data = await this.eventService.createEvent({
      ...req.body,
      createdBy: getActorId(req, req.body.createdBy),
    });
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

  updateEvent = asyncHandler(async (req, res) => {
    const data = await this.eventService.updateEvent(req.params.eventId, req.body);
    res.json({ success: true, message: 'Operation successful', data });
  });

  deleteEvent = asyncHandler(async (req, res) => {
    const data = await this.eventService.deleteEvent(req.params.eventId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { EventController };
