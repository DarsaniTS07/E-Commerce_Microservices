require('dotenv').config();
const mongoose = require('mongoose');
const { ProductModel } = require('../src/services/event/model');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const filter = { isDeleted: { $ne: true } };
  const count = await ProductModel.countDocuments(filter);
  const one = await ProductModel.findOne(filter).lean();

  console.log('event-doc-count', count);
  console.log('sample-eventId', one ? one.eventId : null);

  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error.message);
  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore disconnect errors on failure path
  }
  process.exit(1);
});
