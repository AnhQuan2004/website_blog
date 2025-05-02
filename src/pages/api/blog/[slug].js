import connectDB from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';

export default async function handler(req, res) {
  const { slug } = req.query;
  
  await connectDB();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        // Find blog post by slug
        const blogPost = await BlogPost.findOne({ slug });
        
        if (!blogPost) {
          return res.status(404).json({ error: 'Blog post not found' });
        }

        // Increment view count
        blogPost.views += 1;
        await blogPost.save();
        
        // Return formatted post
        return res.status(200).json({
          ...blogPost._doc,
          id: blogPost._id.toString(),
          createdAt: blogPost.createdAt.toISOString(),
          updatedAt: blogPost.updatedAt.toISOString()
        });
      } catch (error) {
        console.error('Error fetching blog post:', error);
        return res.status(500).json({ error: 'Error fetching blog post' });
      }

    case 'PUT':
      try {
        // Update blog post
        const blogPost = await BlogPost.findOneAndUpdate(
          { slug },
          req.body,
          { new: true, runValidators: true }
        );
        
        if (!blogPost) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        
        // Return updated post
        return res.status(200).json({
          ...blogPost._doc,
          id: blogPost._id.toString(),
          createdAt: blogPost.createdAt.toISOString(),
          updatedAt: blogPost.updatedAt.toISOString()
        });
      } catch (error) {
        console.error('Error updating blog post:', error);
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({ error: error.message });
        }
        
        return res.status(500).json({ error: 'Error updating blog post' });
      }

    case 'DELETE':
      try {
        // Delete blog post
        const blogPost = await BlogPost.findOneAndDelete({ slug });
        
        if (!blogPost) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        
        return res.status(200).json({ message: 'Blog post deleted successfully' });
      } catch (error) {
        console.error('Error deleting blog post:', error);
        return res.status(500).json({ error: 'Error deleting blog post' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 