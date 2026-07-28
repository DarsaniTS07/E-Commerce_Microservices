const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { UserService } = require('./services/user.service');
const createUserRoutes = require('./routes/user.routes');

const { attachAuthContext } = require('./middlewares/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use(attachAuthContext);

const userService = new UserService();

app.use('/users', createUserRoutes(userService));

const fs = require('fs');
app.use((err, req, res, next) => {
  console.error(err.stack);
  try {
    fs.appendFileSync('error.log', new Date().toISOString() + '\\n' + (err.stack || err.toString()) + '\\n\\n');
  } catch(e) {}
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
