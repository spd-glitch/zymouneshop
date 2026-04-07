#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config();

const Staff = require('./src/models/Staff');
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://trinavaldezmalit4_db_user:feedsupply@cluster0.zlha3qw.mongodb.net/feeds_store?retryWrites=true&w=majority&appName=Cluster0';

async function seedStaff() {
  try {
    await mongoose.connect(mongoUri, {
      dbName: 'feeds_store',
      tls: true,
      tlsAllowInvalidCertificates: false,
    });

    console.log('✅ Connected to MongoDB');

    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email: 'staff@example.com' });
    if (existingStaff) {
      console.log('⚠️  Staff member already exists');
      await mongoose.disconnect();
      return;
    }

    // Create sample staff
    const staff = new Staff({
      firstName: 'John',
      lastName: 'Doe',
      email: 'staff@example.com',
      password: 'password123',
      status: 'active',
      role: 'staff'
    });

    await staff.save();
    console.log('✅ Staff created successfully!');
    console.log('📧 Email: staff@example.com');
    console.log('🔑 Password: password123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedStaff();
