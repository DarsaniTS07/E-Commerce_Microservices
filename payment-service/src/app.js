const express = require('express');

const { requestLogger } = require('./middlewares/requestLogger');
const { attachAuthContext } = require('./middlewares/auth');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const createPaymentRoutes = require('./routes/payment.routes');
const { PaymentService } = require('./services/payment.service');
const { PaymentRepository } = require('./repositories/payment.repository');
const { OrderClient } = require('./clients/order.client');
const { InventoryClient } = require('./clients/inventory.client');


function createApp() {
  const app = express();
  const paymentRepository = new PaymentRepository();
  const orderClient = new OrderClient(process.env.ORDER_SERVICE_BASE_URL);
  const inventoryClient = new InventoryClient(process.env.INVENTORY_SERVICE_BASE_URL);
  const paymentService = new PaymentService(paymentRepository, orderClient, inventoryClient);

  app.use(express.json());
  app.use(attachAuthContext);
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Operation successful', data: { status: 'ok' } });
  });

  app.use('/payments', createPaymentRoutes(paymentService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
