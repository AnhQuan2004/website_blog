import jwt from 'jsonwebtoken';
import connectDB from '../../lib/mongodb';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

// Simple API request and response types
interface ApiRequest {
  body: {
    email: string;
    password: string;
    name: string;
  };
  method: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
}

export default async function handler(
  req: ApiRequest,
  res: ApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Connect to MongoDB
    await connectDB();
    
    // Get the User model
    const UserModel = mongoose.models.User || mongoose.model('User');

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser) {
      console.log('Signup failed: User already exists', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new UserModel({
      email,
      password,
      name,
    });

    await user.save();
    console.log('User created successfully:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 