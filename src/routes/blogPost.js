import express from 'express';
import BlogPost from '../models/BlogPost.js';
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

// Middleware to check if user can manage posts
const canManagePostMiddleware = async (req, res, next) => {
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
    
    // Check if user can modify this post
    if (req.params.slug) {
      const blogPost = await BlogPost.findOne({ slug: req.params.slug });
      
      if (!blogPost) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      // If user is ADMIN or MANAGER, they can edit any post
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        return next();
      }
      
      // Otherwise, users can only edit their own posts
      if (blogPost.authorId !== user._id.toString()) {
        return res.status(403).json({ error: 'You do not have permission to modify this post' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Add a debug route to test API accessibility
router.get('/debug', (req, res) => {
  console.log('Debug route accessed');
  return res.status(200).json({ message: 'Blog API is working' });
});

// GET /api/blog - Get all blog posts
router.get('/', async (req, res) => {
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
});

// GET /api/blog/user/:userId - Get blog posts by specific user (for MANAGER and ADMIN roles)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Only MANAGER and ADMIN can view other users' posts
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' && req.user._id.toString() !== userId) {
      return res.status(403).json({ error: 'You do not have permission to view these posts' });
    }
    
    // Build query
    const query = { authorId: userId };
    
    // Count total documents for pagination
    const total = await BlogPost.countDocuments(query);
    
    // Fetch posts with pagination
    const posts = await BlogPost.find(query)
      .sort({ [sort as string]: order === 'asc' ? 1 : -1 })
      .limit(parseInt(limit as string))
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .select('-__v');
    
    // Format posts
    const formattedPosts = posts.map(post => ({
      ...post._doc,
      id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));
    
    return res.status(200).json({
      posts: formattedPosts,
      pagination: {
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Error fetching user blog posts:', error);
    return res.status(500).json({ error: 'Error fetching user blog posts' });
  }
});

// POST /api/blog - Create a new blog post
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'No data provided' });
    }

    // Generate slug from title if not provided
    const postData = { ...req.body };
    if (!postData.slug && postData.title) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }

    // Check for duplicate slug
    const existingPost = await BlogPost.findOne({ slug: postData.slug });
    if (existingPost) {
      // Add a unique suffix to the slug
      postData.slug = `${postData.slug}-${Date.now().toString().slice(-6)}`;
    }

    // Create new blog post
    const blogPost = await BlogPost.create(postData);
    
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
});

// GET /api/blog/:slug - Get a single blog post
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    console.log(`GET request for blog post with slug: ${slug}`);
    
    if (!slug || slug === 'undefined') {
      console.log('Invalid slug parameter');
      return res.status(400).json({ error: 'Invalid slug parameter' });
    }
    
    // Find blog post by slug
    const blogPost = await BlogPost.findOne({ slug: slug });
    
    if (!blogPost) {
      console.log(`Blog post with slug '${slug}' not found`);
      
      // List available slugs for debugging
      const availablePosts = await BlogPost.find({}, 'title slug -_id');
      console.log('Available posts:', availablePosts);
      
      return res.status(404).json({ error: 'Blog post not found', availablePosts });
    }

    console.log(`Found blog post: ${blogPost.title}`);
    
    // Increment view count
    blogPost.views += 1;
    await blogPost.save();
    
    // Return formatted post
    const responseData = {
      ...blogPost._doc,
      id: blogPost._id.toString(),
      createdAt: blogPost.createdAt.toISOString(),
      updatedAt: blogPost.updatedAt.toISOString()
    };
    
    console.log(`Returning blog post data with id: ${responseData.id}`);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return res.status(500).json({ error: 'Error fetching blog post' });
  }
});

// PUT /api/blog/:slug - Update a blog post
router.put('/:slug', canManagePostMiddleware, async (req, res) => {
  try {
    // Update blog post
    const blogPost = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
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
});

// DELETE /api/blog/:slug - Delete a blog post
router.delete('/:slug', canManagePostMiddleware, async (req, res) => {
  try {
    // Delete blog post
    const blogPost = await BlogPost.findOneAndDelete({ slug: req.params.slug });
    
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    return res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return res.status(500).json({ error: 'Error deleting blog post' });
  }
});

export default router; 