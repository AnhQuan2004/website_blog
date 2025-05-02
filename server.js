import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Send warnings if using default values
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: Using default JWT_SECRET. This is insecure for production!');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:5173', 'http://localhost:8082', 'http://localhost:8083'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    if (req.url.includes('/auth')) {
      // Mask sensitive data in authentication routes
      const sensitiveDataMasked = { ...req.body };
      if (sensitiveDataMasked.password) sensitiveDataMasked.password = '********';
      console.log('Request body:', sensitiveDataMasked);
    } else {
      // Truncate large request bodies
      console.log('Request body:', JSON.stringify(req.body, null, 2).substring(0, 1000));
    }
  }
  if (req.headers.authorization) {
    console.log('Auth header present');
  }
  next();
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  seedBlogPostsIfEmpty(); // Seed initial blog posts if none exist
})
.catch(err => console.error('MongoDB connection error:', err));

// Function to seed initial blog posts if the database is empty
const seedBlogPostsIfEmpty = async () => {
  try {
    // Check if we already have blog posts
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', mongoose.Schema({}));
    const count = await BlogPost.countDocuments();
    
    if (count === 0) {
      console.log('No blog posts found, seeding initial data...');
      
      // Import the sample posts data
      const samplePosts = [
        {
          title: 'Getting Started with React',
          slug: 'getting-started-with-react',
          excerpt: 'Learn the basics of React and how to set up your first React application.',
          content: '# Getting Started with React\n\nReact is a JavaScript library for building user interfaces. It allows you to create reusable UI components that update efficiently when your data changes.\n\n## Setting Up\n\nTo get started with React, you\'ll need to have Node.js installed. Then you can create a new React application using Create React App:\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\nThis will set up a new React project with a development server.',
          coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
          authorId: '1',
          authorName: 'John Doe',
          authorAvatar: 'https://i.pravatar.cc/150?u=john',
          category: 'React',
          tags: ['React', 'JavaScript', 'Frontend'],
          readTime: 5,
          featured: true,
          views: 0
        },
        {
          title: 'Introduction to MongoDB',
          slug: 'introduction-to-mongodb',
          excerpt: 'Discover MongoDB, a popular NoSQL database, and learn how to use it in your applications.',
          content: '# Introduction to MongoDB\n\nMongoDB is a document-oriented NoSQL database that provides high performance, high availability, and easy scalability.\n\n## Key Features\n\n- Document-oriented storage\n- Full index support\n- Replication & high availability\n- Auto-sharding\n- Rich queries\n\n## Getting Started\n\nTo start using MongoDB, you can install it locally or use a cloud service like MongoDB Atlas.',
          coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
          authorId: '2',
          authorName: 'Jane Smith',
          authorAvatar: 'https://i.pravatar.cc/150?u=jane',
          category: 'Database',
          tags: ['MongoDB', 'NoSQL', 'Database'],
          readTime: 7,
          featured: false,
          views: 0
        }
      ];
      
      // Insert the sample posts
      await BlogPost.insertMany(samplePosts);
      console.log('Database seeded successfully with initial blog posts!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: ['ADMIN', 'DEFAULT', 'MANAGER'],
    default: 'DEFAULT',
  },
  avatar: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware for protected routes
const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Manager middleware for protected routes
const managerMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      return res.status(403).json({ message: 'Access denied. Manager privileges required.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// API Endpoints

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    console.log('User created successfully:', user.email);
    
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
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('User logged in:', user.email);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update User Route
app.put('/api/user/update', authMiddleware, async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, bio },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
});

// User Management Routes
app.get('/api/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -__v')
      .sort({ createdAt: -1 });
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    }));
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/users/:id', adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['ADMIN', 'DEFAULT', 'MANAGER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Load API routes from modules
import BlogPostRoutes from './src/routes/blogPost.js';
import CommentRoutes from './src/routes/comment.js';

// Apply API routes
console.log('Mounting /api/blog routes');
app.use('/api/blog', BlogPostRoutes);
console.log('Mounting /api/comments routes');
app.use('/api/comments', CommentRoutes);

// Add a root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Blog API server is running' });
});

// Add a test route to check API accessibility
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is accessible' });
});

// Global error handler to ensure JSON responses
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 