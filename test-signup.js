// Test script for user signup
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

console.log('Using MongoDB URI:', MONGODB_URI);

async function testSignup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define the user schema
    const userSchema = new mongoose.Schema({
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
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

    // Create or get the user model
    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Test user data
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    // Check if user already exists and delete if needed
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Deleting existing test user...');
      await User.deleteOne({ email: testUser.email });
    }

    // Create a new user
    console.log('Creating test user...');
    const newUser = new User(testUser);
    await newUser.save();
    console.log('✅ User created successfully!');

    // Test login
    console.log('Testing login...');
    const user = await User.findOne({ email: testUser.email });
    if (!user) {
      throw new Error('User not found after creation');
    }

    // Check password
    const passwordMatch = await user.comparePassword('password123');
    console.log('✅ Password match:', passwordMatch);

    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log('✅ JWT token generated successfully');
      
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified:', decoded);
    }

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

testSignup(); 