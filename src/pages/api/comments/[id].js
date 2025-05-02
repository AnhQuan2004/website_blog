import connectDB from '../../../lib/db';
import Comment from '../../../models/Comment';

export default async function handler(req, res) {
  const { id } = req.query;
  
  await connectDB();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        // Find comment by ID
        const comment = await Comment.findById(id);
        
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

    case 'PUT':
      try {
        // Update comment
        const comment = await Comment.findByIdAndUpdate(
          id,
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

    case 'DELETE':
      try {
        // Delete comment
        const comment = await Comment.findByIdAndDelete(id);
        
        if (!comment) {
          return res.status(404).json({ error: 'Comment not found' });
        }
        
        return res.status(200).json({ message: 'Comment deleted successfully' });
      } catch (error) {
        console.error('Error deleting comment:', error);
        return res.status(500).json({ error: 'Error deleting comment' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 