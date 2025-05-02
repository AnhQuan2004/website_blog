import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    index: true // Add index for faster lookups
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image URL is required']
  },
  authorId: {
    type: String,
    required: [true, 'Author ID is required']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },
  authorAvatar: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  readTime: {
    type: Number,
    default: 5
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug from title if not provided
BlogPostSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  }
  
  // Log slug generation
  console.log(`Generated/using slug: ${this.slug} for post: ${this.title}`);
  next();
});

// Calculate read time based on content length (average reading speed: 200 words per minute)
BlogPostSchema.pre('save', function(next) {
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  next();
});

// Add a toString method to make debugging easier
BlogPostSchema.methods.toString = function() {
  return `BlogPost: ${this.title} (${this.slug})`;
};

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost; 