const { asyncHandler } = require('../../../E-Commerce/backend/src/utils/asyncHandler');
const { getActorId } = require('../../../E-Commerce/backend/src/utils/requestContext');

class OrderController {
  constructor(orderService, cartRepository) {
    this.orderService = orderService;
    this.cartRepository = cartRepository;
  }

  createOrder = asyncHandler(async (req, res) => {
    const cart = await this.cartRepository.findByCartId(req.body.cartId);
    const data = await this.orderService.createFromCart(cart);
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

  getOrder = asyncHandler(async (req, res) => {
    const data = await this.orderService.getOrder(req.params.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getUserOrders = asyncHandler(async (req, res) => {
    const data = await this.orderService.getUserOrders(getActorId(req, req.params.userId));
    res.json({ success: true, message: 'Operation successful', data });
  });

  cancelOrder = asyncHandler(async (req, res) => {
    const data = await this.orderService.cancelOrder(req.params.orderId, req.body.reason);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getTicket = asyncHandler(async (req, res) => {
    const data = await this.orderService.getTicket(req.params.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { OrderController };
