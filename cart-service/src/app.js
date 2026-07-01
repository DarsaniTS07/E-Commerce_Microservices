const express = require('express');

const { requestLogger } = require('./middlewares/requestLogger');
const { attachAuthContext } = require('./middlewares/auth');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const createCartRoutes = require('./routes/cart.routes');
const { CartService } = require('./services/cart.service');
const { CartRepository } = require('./repositories/cart.repository');
const { InventoryClient } = require('./clients/inventory.client');
const { WaitlistClient } = require('./clients/waitlist.client');


function createApp() {
  const app = express();
  const cartRepository = new CartRepository();
  const inventoryClient = new InventoryClient(process.env.INVENTORY_SERVICE_BASE_URL);
  const waitlistClient = new WaitlistClient(process.env.WAITLIST_SERVICE_BASE_URL);
  const cartService = new CartService(cartRepository, inventoryClient, waitlistClient);

  app.use(express.json());
  app.use(attachAuthContext);
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Operation successful', data: { status: 'ok' } });
  });

  app.use('/cart', createCartRoutes(cartService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
