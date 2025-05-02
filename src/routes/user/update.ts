import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/middleware/auth';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const user = (req as any).user;
    const { name, email } = req.body;

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export default authMiddleware(handler); 