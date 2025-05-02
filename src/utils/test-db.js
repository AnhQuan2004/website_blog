// Simple script to test database connection
import connectDB from '../lib/mongodb.js';

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const mongoose = await connectDB();
    console.log('MongoDB connection successful!');
    
    // Print available models
    console.log('Available models:', Object.keys(mongoose.models));
    
    // Test User model if it exists
    if (mongoose.models.User) {
      const count = await mongoose.models.User.countDocuments();
      console.log(`User model found with ${count} documents`);
    } else {
      console.log('User model not found');
    }
    
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  } finally {
    process.exit(0);
  }
}

testConnection(); 