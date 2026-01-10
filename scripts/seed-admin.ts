#!/usr/bin/env node

/**
 * Seed script to create an initial admin user
 * Usage: npm run seed:admin
 * 
 * Requires environment variables:
 * - MONGODB_URI
 * - ADMIN_USERNAME
 * - ADMIN_PASSWORD
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { hashPassword } from '../src/lib/auth';
import User from '../src/models/User';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function seedAdmin() {
  if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  if (!ADMIN_USERNAME) {
    console.error('❌ Error: ADMIN_USERNAME environment variable is not set');
    process.exit(1);
  }

  if (!ADMIN_PASSWORD) {
    console.error('❌ Error: ADMIN_PASSWORD environment variable is not set');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: ADMIN_USERNAME.toLowerCase() });
    
    if (existingAdmin) {
      console.log(`ℹ️  Admin user with username ${ADMIN_USERNAME} already exists`);
      
      // Update password if needed
      const passwordHash = await hashPassword(ADMIN_PASSWORD);
      existingAdmin.passwordHash = passwordHash;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('✅ Updated existing admin user password');
    } else {
      // Create new admin user
      const passwordHash = await hashPassword(ADMIN_PASSWORD);
      
      const admin = await User.create({
        username: ADMIN_USERNAME.toLowerCase(),
        passwordHash,
        role: 'admin'
      });

      console.log(`✅ Created admin user: ${admin.username}`);
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedAdmin();
