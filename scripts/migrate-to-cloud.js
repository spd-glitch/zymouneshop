#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

// Change to project root
process.chdir(path.join(__dirname, '..'));

const Staff = require('./src/models/Staff');
const Product = require('./src/models/Product');
const Sale = require('./src/models/Sale');
const Order = require('./src/models/Order');

const localUri = 'mongodb://localhost:27017/feeds_store';
const cloudUri = process.env.MONGODB_URI || 'mongodb+srv://trinavaldezmalit4_db_user:feedsupply@cluster0.zlha3qw.mongodb.net/feeds_store?retryWrites=true&w=majority&appName=Cluster0';

async function migrateData() {
  try {
    console.log('📊 Starting data migration...');
    console.log('📍 From: Local MongoDB');
    console.log('📍 To: MongoDB Atlas (Cloud)');

    // Connect to local database
    const localConnection = await mongoose.createConnection(localUri, {
      dbName: 'feeds_store'
    });

    console.log('✅ Connected to local database');

    // Get collections from local database
    const LocalStaff = localConnection.model('Staff', require('./src/models/Staff').schema);
    const LocalProduct = localConnection.model('Product', require('./src/models/Product').schema);
    const LocalSale = localConnection.model('Sale', require('./src/models/Sale').schema);
    const LocalOrder = localConnection.model('Order', require('./src/models/Order').schema);

    // Fetch all data from local
    const [staffData, productData, saleData, orderData] = await Promise.all([
      LocalStaff.find({}),
      LocalProduct.find({}),
      LocalSale.find({}),
      LocalOrder.find({})
    ]);

    console.log(`📦 Found ${staffData.length} staff members`);
    console.log(`📦 Found ${productData.length} products`);
    console.log(`📦 Found ${saleData.length} sales`);
    console.log(`📦 Found ${orderData.length} orders`);

    // Connect to cloud database
    await mongoose.connect(cloudUri, {
      dbName: 'feeds_store',
      tls: true,
      tlsAllowInvalidCertificates: false,
    });

    console.log('✅ Connected to MongoDB Atlas (Cloud)');

    // Migrate staff
    if (staffData.length > 0) {
      await Staff.deleteMany({}); // Clear existing
      const createdStaff = await Staff.insertMany(staffData.map(s => s.toObject()));
      console.log(`✅ Migrated ${createdStaff.length} staff members`);
    }

    // Migrate products
    if (productData.length > 0) {
      await Product.deleteMany({}); // Clear existing
      const createdProducts = await Product.insertMany(productData.map(p => p.toObject()));
      console.log(`✅ Migrated ${createdProducts.length} products`);
    }

    // Migrate sales
    if (saleData.length > 0) {
      await Sale.deleteMany({}); // Clear existing
      const createdSales = await Sale.insertMany(saleData.map(s => s.toObject()));
      console.log(`✅ Migrated ${createdSales.length} sales`);
    }

    // Migrate orders
    if (orderData.length > 0) {
      await Order.deleteMany({}); // Clear existing
      const createdOrders = await Order.insertMany(orderData.map(o => o.toObject()));
      console.log(`✅ Migrated ${createdOrders.length} orders`);
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('Your data is now live on MongoDB Atlas');

    await localConnection.disconnect();
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateData();
