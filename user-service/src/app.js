const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const { UserService } = require('./services/user.service');
const createUserRoutes = require('./routes/user.routes');
const { attachAuthContext } = require('./middlewares/auth');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use(attachAuthContext);

  const userService = new UserService();

  app.use('/api/v1/users', createUserRoutes(userService));
  app.use('/users', createUserRoutes(userService));

  const fs = require('fs');
  app.use((err, req, res, next) => {
    console.error(err.stack);
    try {
      // In Lambda, writing to the root directory is not allowed. 
      // We use /tmp/ or console.error directly.
      fs.appendFileSync('/tmp/error.log', new Date().toISOString() + '\n' + (err.stack || err.toString()) + '\n\n');
    } catch(e) {}
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  });

  return app;
}

module.exports = { createApp };

