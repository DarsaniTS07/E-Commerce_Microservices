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
  const os = require('os');
  const path = require('path');
  let tempDir = null;

  app.use((err, req, res, next) => {
    console.error(err.stack);
    try {
      // In Lambda, writing to the root directory is not allowed. 
      // We safely create a unique temp dir inside the OS tmp directory to avoid SonarQube S5443.
      if (!tempDir) {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-errors-'));
      }
      fs.appendFileSync(path.join(tempDir, 'error.log'), new Date().toISOString() + '\n' + (err.stack || err.toString()) + '\n\n');
    } catch(e) {}
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error'
    });
  });

  return app;
}

module.exports = { createApp };

