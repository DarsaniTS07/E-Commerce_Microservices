const express = require('express');
const swaggerUi = require('swagger-ui-express');


const { requestLogger } = require('./middlewares/requestLogger');
const { attachAuthContext } = require('./middlewares/auth');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const { buildServices } = require('./services');
const swaggerSpec = require('./config/swagger');


function createApp() {
  const app = express();
  const services = buildServices();

  app.use(express.json());
  app.use(attachAuthContext);
  app.use(requestLogger);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Operation successful', data: { status: 'ok' } });
  });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


  app.use('/events', require('./services/event/routes')(services.eventService));
  app.use('/inventory', require('./services/inventory/routes')(services.inventoryService));
  app.use('/cart', require('./services/cart/routes')(services.cartService));
  app.use('/orders', require('./services/order/routes')(services.orderService));
  app.use('/payments', require('./services/payment/routes')(services.paymentService));
  app.use('/waitlist', require('./services/waitlist/routes')(services.waitlistService));
  app.use('/notifications', require('./services/notification/routes')(services.notificationService));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
