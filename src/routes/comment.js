import express from 'express';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Authentication middleware for protected routes
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secure-jwt-secret');
    const UserModel = mongoose.models.User || mongoose.model('User');
    const user = await UserModel.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// GET /api/comments - Get comments for an article
router.get('/', async (req, res) => {
  try {
    const { articleId } = req.query;

    if (!articleId) {
      return res.status(400).json({ error: 'Article ID is required' });
    }

    // Fetch comments for the specified article
    const comments = await Comment.find({ articleId })
      .sort({ createdAt: -1 })
      .select('-__v');

    // Format the comments for the client
    const formattedComments = comments.map(comment => ({
      ...comment._doc,
      id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    }));

    return res.status(200).json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ error: 'Error fetching comments' });
  }
});

// POST /api/comments - Create a new comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Ensure authorId matches authenticated user
    if (req.body.authorId !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Author ID must match authenticated user' });
    }

    // Create new comment
    const comment = await Comment.create(req.body);

    return res.status(201).json({
      ...comment._doc,
      id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Error creating comment' });
  }
});

// GET /api/comments/:id - Get a single comment
router.get('/:id', async (req, res) => {
  try {
    // Find comment by ID
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Return formatted comment
    return res.status(200).json({
      ...comment._doc,
      id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    return res.status(500).json({ error: 'Error fetching comment' });
  }
});

// PUT /api/comments/:id - Update a comment
router.put('/:id', async (req, res) => {
  try {
    // Update comment
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Return updated comment
    return res.status(200).json({
      ...comment._doc,
      id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    return res.status(500).json({ error: 'Error updating comment' });
  }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // First find the comment to check ownership
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user is the comment owner or an admin
    if (comment.authorId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You do not have permission to delete this comment' });
    }
    
    // Delete comment
    await Comment.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ error: 'Error deleting comment' });
  }
});

export default router; 