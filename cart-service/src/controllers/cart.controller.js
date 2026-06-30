const { asyncHandler } = require('../../../E-Commerce/backend/src/utils/asyncHandler');
const { getActorId } = require('../../../E-Commerce/backend/src/utils/requestContext');

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
}

module.exports = { CartController };
