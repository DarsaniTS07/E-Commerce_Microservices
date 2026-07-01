const express = require('express');

const { requestLogger } = require('./middlewares/requestLogger');
const { attachAuthContext } = require('./middlewares/auth');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const createEventRoutes = require('./routes/event.routes');
const { EventService } = require('./services/event.service');
const { EventRepository } = require('./repositories/event.repository');
const { InventoryClient } = require('./clients/inventory.client');


function createApp() {
  const app = express();
  const eventRepository = new EventRepository();
  const inventoryClient = new InventoryClient(process.env.INVENTORY_SERVICE_BASE_URL);
  const eventService = new EventService(eventRepository, inventoryClient);

  app.use(express.json());
  app.use(attachAuthContext);
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Operation successful', data: { status: 'ok' } });
  });

  app.use('/events', createEventRoutes(eventService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
