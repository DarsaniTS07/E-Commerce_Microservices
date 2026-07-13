const express = require('express');

const { requestLogger } = require('./middlewares/requestLogger');
const { attachAuthContext } = require('./middlewares/auth');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const createOrderRoutes = require('./routes/order.routes');
const { OrderService } = require('./services/order.service');
const { OrderRepository } = require('./repositories/order.repository');
const { CartClient } = require('./clients/cart.client');
const { EventClient } = require('./clients/event.client');
const { InventoryClient } = require('./clients/inventory.client');
const { WaitlistClient } = require('./clients/waitlist.client');
const { SnsClient } = require('./clients/sns.client');


function createApp() {
  const app = express();
  const orderRepository = new OrderRepository();
  const cartClient = new CartClient(process.env.CART_SERVICE_BASE_URL);
  const eventClient = new EventClient(process.env.EVENT_SERVICE_BASE_URL);
  const inventoryClient = new InventoryClient(process.env.INVENTORY_SERVICE_BASE_URL);
  const waitlistClient = new WaitlistClient(process.env.WAITLIST_SERVICE_BASE_URL);
  const snsClient = new SnsClient();
  const orderService = new OrderService(
  orderRepository,
  inventoryClient,
  eventClient,
  waitlistClient,
  cartClient,
  snsClient
);

  app.use(express.json());
  app.use(attachAuthContext);
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Operation successful', data: { status: 'ok' } });
  });

  app.use('/orders', createOrderRoutes(orderService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
