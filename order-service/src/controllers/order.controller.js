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
    const requestedUserId = req.params.userId;
    const actorId = getActorId(req);
    const actorRole = req.user?.role || req.user?.['custom:role'] || (req.user?.['cognito:groups']?.map(g => String(g).toLowerCase())?.includes('admin') ? 'admin' : 'user');
    const isAdmin = actorRole?.toLowerCase() === 'admin';
    
    // If not Admin and trying to access someone else's orders, deny.
    if (requestedUserId !== actorId && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const data = await this.orderService.getUserOrders(requestedUserId || actorId);
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

  getAllOrders = asyncHandler(async (req, res) => {
    const data = await this.orderService.getAllOrders();
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { OrderController };
