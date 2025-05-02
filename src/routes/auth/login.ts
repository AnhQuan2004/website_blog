import jwt from 'jsonwebtoken';
import connectDB from '../../lib/mongodb';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

// Simple API request and response types
interface ApiRequest {
  body: {
    email: string;
    password: string;
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Connect to MongoDB
    await connectDB();
    
    // Get the User model
    const UserModel = mongoose.models.User || mongoose.model('User');
    
    // Find user by email
    const user = await UserModel.findOne({ email }).exec();
    
    if (!user) {
      console.log('Login failed: User not found', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Password mismatch', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful:', email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 