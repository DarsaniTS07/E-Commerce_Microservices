const { asyncHandler } = require('../../../E-Commerce/backend/src/utils/asyncHandler');
const { getActorId } = require('../../../E-Commerce/backend/src/utils/requestContext');

class EventController {
  constructor(productService) {
    this.productService = productService;
  }

  listEvents = asyncHandler(async (req, res) => {
    const data = await this.productService.listEvents(req.query);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getEventDetails = asyncHandler(async (req, res) => {
    const data = await this.productService.getEventDetails(req.params.eventId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  createEvent = asyncHandler(async (req, res) => {
    const data = await this.productService.createEvent({
      ...req.body,
      createdBy: getActorId(req, req.body.createdBy),
    });
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

  updateEvent = asyncHandler(async (req, res) => {
    const data = await this.productService.updateEvent(req.params.eventId, req.body);
    res.json({ success: true, message: 'Operation successful', data });
  });

  deleteEvent = asyncHandler(async (req, res) => {
    const data = await this.productService.deleteEvent(req.params.eventId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { EventController };
