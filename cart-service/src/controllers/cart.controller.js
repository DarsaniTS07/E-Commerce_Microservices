const { asyncHandler } = require('../utils/asyncHandler');
const { getActorId } = require('../utils/requestContext');

class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  addItem = asyncHandler(async (req, res) => {
    const data = await this.cartService.addItem({
      ...req.body,
      userId: getActorId(req, req.body.userId),
    });
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

  viewCart = asyncHandler(async (req, res) => {
    const data = await this.cartService.viewCart(getActorId(req, req.query.userId));
    res.json({ success: true, message: 'Operation successful', data });
  });

  updateQuantity = asyncHandler(async (req, res) => {
    const data = await this.cartService.updateQuantity({
      ...req.body,
      userId: getActorId(req, req.body.userId),
    });
    res.json({ success: true, message: 'Operation successful', data });
  });

  removeItem = asyncHandler(async (req, res) => {
    const data = await this.cartService.removeItem({
      ...req.body,
      userId: getActorId(req, req.body.userId),
    });
    res.json({ success: true, message: 'Operation successful', data });
  });

  getCartItem = asyncHandler(async (req, res) => {
    const data = await this.cartService.getCartItem(req.query.userId, req.params.cartId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  checkoutCart = asyncHandler(async (req, res) => {
    const data = await this.cartService.checkoutCart(req.params.cartId, req.body.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { CartController };
