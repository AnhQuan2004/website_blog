import jwt from 'jsonwebtoken';
import connectDB from '../lib/mongodb';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';

// Simple API request and response types
interface ApiRequest {
  headers: {
    authorization?: string;
  };
  user?: any;
  body: any;
  method: string;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: any) => void;
}

export const authMiddleware = (handler: Function) => async (
  req: ApiRequest,
  res: ApiResponse
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      // Connect to MongoDB
      await connectDB();
      
      // Get User model
      const UserModel = mongoose.models.User || mongoose.model('User');
      
      // Find user by ID
      const user = await UserModel.findById(decoded.userId).exec();

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Add user to request object
      req.user = user;
      return handler(req, res);
    } catch (tokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 