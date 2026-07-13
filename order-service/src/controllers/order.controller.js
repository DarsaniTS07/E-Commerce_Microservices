const { asyncHandler } = require('../utils/asyncHandler');
const { getActorId } = require('../utils/requestContext');

class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  createOrder = asyncHandler(async (req, res) => {
    const data = await this.orderService.createFromCartId(req.body.cartId);
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

  getOrder = asyncHandler(async (req, res) => {
    const data = await this.orderService.getOrder(req.params.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getUserOrders = asyncHandler(async (req, res) => {
const data = await this.orderService.getUserOrders(getActorId(req));
    res.json({ success: true, message: 'Operation successful', data });
  });

  cancelOrder = asyncHandler(async (req, res) => {
    const data = await this.orderService.cancelOrder(req.params.orderId, req.body.reason);
    res.json({ success: true, message: 'Operation successful', data });
  });

  confirmOrder = asyncHandler(async (req, res) => {
    const data = await this.orderService.confirmOrder(req.params.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getTicket = asyncHandler(async (req, res) => {
    const data = await this.orderService.getTicket(req.params.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { OrderController };
