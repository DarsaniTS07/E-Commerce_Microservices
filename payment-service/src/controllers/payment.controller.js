const { asyncHandler } = require('../utils/asyncHandler');

class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  initiatePayment = asyncHandler(async (req, res) => {
    const data = await this.paymentService.initiatePayment(req.body);
    res.status(201).json({ success: true, message: 'Operation successful', data });
  });

  paymentCallback = asyncHandler(async (req, res) => {
    const data = await this.paymentService.handleCallback(req.body);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getPaymentStatus = asyncHandler(async (req, res) => {
    const data = await this.paymentService.getPaymentStatus(req.params.orderId);
    res.json({ success: true, message: 'Operation successful', data });
  });

  getRefunds = asyncHandler(async (req, res) => {
    const data = await this.paymentService.getRefunds();
    res.json({ success: true, message: 'Operation successful', data });
  });
}

module.exports = { PaymentController };
