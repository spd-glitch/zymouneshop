// Script to count total orders in the database
// Usage: node scripts/count-orders.js

const mongoose = require('mongoose');
const Order = require('../src/models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zymounefeedsupply';

async function countOrders() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const count = await Order.countDocuments();
  console.log(`Total orders in database: ${count}`);
  await mongoose.disconnect();
}

countOrders().catch(err => {
  console.error('Error counting orders:', err);
  process.exit(1);
});
