// Test database connection
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import BlogPost from './src/models/BlogPost.js';
import Comment from './src/models/Comment.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db';
console.log('Using MongoDB URI:', MONGODB_URI);

const defaultBlogPosts = [
  {
    title: 'The Future of Artificial Intelligence: Exploring New Frontiers',
    slug: 'future-of-artificial-intelligence',
    excerpt: 'Discover how AI is transforming industries and what the future holds for this revolutionary technology.',
    content: `
# The Future of Artificial Intelligence

Artificial Intelligence (AI) has rapidly evolved from a theoretical concept to a transformative force across various industries. In this article, we explore the current state of AI technology and glimpse into its promising future.

## Current Applications

### Healthcare
AI is revolutionizing diagnostics, drug discovery, and personalized medicine. Machine learning algorithms can analyze medical images with remarkable accuracy, often detecting conditions that human doctors might miss.

### Transportation
Self-driving vehicles are becoming increasingly sophisticated, with companies like Tesla, Waymo, and others pushing the boundaries of what's possible. These systems use a combination of computer vision, sensor fusion, and deep learning to navigate complex environments.

### Business and Finance
Predictive analytics powered by AI helps businesses make data-driven decisions, forecast market trends, and optimize operations. In finance, algorithmic trading systems execute trades at speeds impossible for human traders.

## Ethical Considerations

As AI becomes more powerful, ethical concerns are at the forefront of discussions:

1. **Privacy**: How do we balance the data needs of AI with individual privacy rights?
2. **Bias**: How can we ensure AI systems don't perpetuate existing biases?
3. **Accountability**: Who is responsible when AI systems make mistakes?
4. **Job Displacement**: How will society adapt to automation of certain job categories?

## The Road Ahead

The future of AI promises even more groundbreaking developments:

- **General AI**: Moving beyond narrow AI to systems with broader cognitive abilities.
- **AI-Human Collaboration**: Developing frameworks where humans and AI work together synergistically.
- **Quantum Computing**: Leveraging quantum computing to solve complex problems that are currently intractable.
- **Brain-Computer Interfaces**: Creating direct communication channels between the human brain and computers.

The journey of AI is just beginning, and its ultimate impact on society will depend on how we guide its development and implementation.
    `,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    authorId: '1',
    authorName: 'John Doe',
    authorAvatar: 'https://i.pravatar.cc/150?u=john',
    category: 'Artificial Intelligence',
    tags: ['AI', 'Machine Learning', 'Technology', 'Future'],
    readTime: 8,
    featured: true,
    views: 1240
  },
  {
    title: 'Web Development Trends in 2023: What You Need to Know',
    slug: 'web-development-trends-2023',
    excerpt: 'Stay ahead of the curve with these emerging web development technologies and methodologies.',
    content: `
# Web Development Trends in 2023

The web development landscape continues to evolve at a rapid pace. Here are the key trends shaping the industry in 2023.

## Frontend Frameworks

React, Vue, and Angular continue to dominate, but new challengers are emerging. Svelte and Solid.js are gaining popularity for their performance and developer experience.

## Backend Technologies

Node.js remains popular, but Deno and Bun are offering compelling alternatives. WebAssembly is enabling new possibilities for backend development.

## Full-Stack Frameworks

Next.js, Nuxt, and SvelteKit are becoming the standard for building modern web applications, offering excellent developer experience and performance.

## Design Trends

Minimalism, dark mode, and accessibility are now standard considerations. Micro-interactions and subtle animations enhance user experience without overwhelming the interface.

## Performance Optimization

Core Web Vitals continue to be crucial for SEO and user experience. Tools like Lighthouse and WebPageTest are essential for measuring and improving performance.

## Security Considerations

With increasing cyber threats, security is more important than ever. CSP, HTTPS, and regular security audits are becoming standard practice.

Stay ahead of these trends to build web applications that are fast, secure, and delightful to use.
    `,
    coverImage: 'https://images.unsplash.com/photo-1607798748738-b15c40d33d57?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    authorId: '2',
    authorName: 'Jane Smith',
    authorAvatar: 'https://i.pravatar.cc/150?u=jane',
    category: 'Web Development',
    tags: ['JavaScript', 'React', 'Web Development', 'Frontend'],
    readTime: 6,
    featured: false,
    views: 830
  },
  {
    title: 'Cybersecurity Best Practices for Remote Work',
    slug: 'cybersecurity-best-practices-remote-work',
    excerpt: 'Protect your data and systems with these essential cybersecurity measures for remote teams.',
    content: `
# Cybersecurity Best Practices for Remote Work

As remote work becomes increasingly common, cybersecurity has never been more important. This article outlines essential practices to keep your data safe.

## Secure Your Home Network

1. Change default router passwords
2. Enable WPA3 encryption
3. Use a guest network for IoT devices
4. Keep firmware updated

## VPN Usage

Always use a company VPN when accessing sensitive information. This encrypts your connection and helps prevent man-in-the-middle attacks.

## Password Management

Use a password manager to generate and store strong, unique passwords for each service. Enable two-factor authentication wherever possible.

## Device Security

Keep all devices updated with the latest security patches. Use antivirus software and enable disk encryption.

## Phishing Awareness

Be vigilant about phishing attempts, which have increased dramatically during the shift to remote work. Verify sender identities before clicking links or downloading attachments.

Following these practices will significantly reduce your cybersecurity risk while working remotely.
    `,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    authorId: '1',
    authorName: 'John Doe',
    authorAvatar: 'https://i.pravatar.cc/150?u=john',
    category: 'Cybersecurity',
    tags: ['Security', 'Remote Work', 'VPN', 'Data Protection'],
    readTime: 5,
    featured: false,
    views: 615
  }
];

const defaultComments = [
  {
    content: 'Great article! I especially appreciated the insights on AI in healthcare.',
    articleId: '1', // This will be updated after blog post creation
    authorId: '2',
    authorName: 'Jane Smith',
    authorAvatar: 'https://i.pravatar.cc/150?u=jane'
  },
  {
    content: 'I agree with Jane. The healthcare applications are particularly exciting.',
    articleId: '1', // This will be updated after blog post creation
    authorId: '3',
    authorName: 'Robert Johnson',
    authorAvatar: 'https://i.pravatar.cc/150?u=robert'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await BlogPost.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create blog posts
    const createdBlogPosts = await BlogPost.create(defaultBlogPosts);
    console.log(`Created ${createdBlogPosts.length} blog posts`);

    // Create comments with updated blog post IDs
    const commentsWithArticleIds = defaultComments.map(comment => ({
      ...comment,
      articleId: createdBlogPosts[0]._id.toString() // Assign first blog post ID to comments
    }));

    const createdComments = await Comment.create(commentsWithArticleIds);
    console.log(`Created ${createdComments.length} comments`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 