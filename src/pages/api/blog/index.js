import connectDB from '../../../lib/db';
import BlogPost from '../../../models/BlogPost';

export default async function handler(req, res) {
  await connectDB();

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        // Get query parameters for filtering
        const { limit = 10, page = 1, category, tag, featured, sort = 'createdAt', order = 'desc' } = req.query;

        // Build query
        const query = {};
        if (category) query.category = category;
        if (tag) query.tags = { $in: [tag] };
        if (featured === 'true') query.featured = true;

        // Count total documents for pagination
        const total = await BlogPost.countDocuments(query);

        // Fetch posts with pagination
        const posts = await BlogPost.find(query)
          .sort({ [sort]: order === 'asc' ? 1 : -1 })
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit))
          .select('-__v');

        // Format createdAt and updatedAt dates
        const formattedPosts = posts.map(post => ({
          ...post._doc,
          id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString()
        }));

        // Return posts with pagination info
        return res.status(200).json({
          posts: formattedPosts,
          pagination: {
            total,
            pages: Math.ceil(total / parseInt(limit)),
            page: parseInt(page),
            limit: parseInt(limit)
          }
        });
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        return res.status(500).json({ error: 'Error fetching blog posts' });
      }

    case 'POST':
      try {
        if (!req.body) {
          return res.status(400).json({ error: 'No data provided' });
        }

        // Create new blog post
        const blogPost = await BlogPost.create(req.body);
        
        return res.status(201).json({
          ...blogPost._doc,
          id: blogPost._id.toString(),
          createdAt: blogPost.createdAt.toISOString(),
          updatedAt: blogPost.updatedAt.toISOString()
        });
      } catch (error) {
        console.error('Error creating blog post:', error);
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({ error: error.message });
        }
        
        return res.status(500).json({ error: 'Error creating blog post' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 