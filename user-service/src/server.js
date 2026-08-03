const { createApp } = require('./app');

const app = createApp();

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
