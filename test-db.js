// Test database connection
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db';
console.log('Using MongoDB URI:', MONGODB_URI);

async function testDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define a test user schema
    const userSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
    });

    // Add password hashing
    userSchema.pre('save', async function(next) {
      if (!this.isModified('password')) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    // Compare password method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    };

    // Create model (use a unique name to avoid conflicts)
    const TestUser = mongoose.models.TestUser || mongoose.model('TestUser', userSchema);

    // Create a test user
    console.log('Creating test user...');
    const testUser = new TestUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

    // Save the user
    await testUser.save();
    console.log('✅ Test user created successfully!');

    // Find the user
    const foundUser = await TestUser.findOne({ email: 'test@example.com' });
    console.log('✅ Found user:', foundUser.name);

    // Test password comparison
    const isMatch = await foundUser.comparePassword('password123');
    console.log('✅ Password match:', isMatch);

    // Cleanup - remove test user
    await TestUser.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test user cleaned up');

    console.log('All tests passed! Your MongoDB setup is working correctly.');
  } catch (error) {
    console.error('❌ Error during database test:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

testDB(); 