import connectDB from '../../../lib/db';
import Comment from '../../../models/Comment';

export default async function handler(req, res) {
  await connectDB();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
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

    case 'POST':
      try {
        if (!req.body) {
          return res.status(400).json({ error: 'No data provided' });
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

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 