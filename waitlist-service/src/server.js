require('dotenv').config();

const { connectDatabase } = require('./config/db');
const { createApp } = require('./app');

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const port = Number(process.env.PORT || 3000);

  app.listen(port, () => {
    console.log(`Ticket Booking Platform API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
