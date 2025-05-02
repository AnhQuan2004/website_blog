// Mock data for initial development
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';

// Set up axios interceptors for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`Axios Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(`Axios Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Axios Error ${error.response.status}: ${error.response.data?.error || error.message}`);
    } else if (error.request) {
      console.error('Axios Error: No response received', error.request);
    } else {
      console.error('Axios Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  views: number;
};

export type Comment = {
  id: string;
  articleId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
};

// Safe check for window object to avoid SSR issues
const isBrowser = typeof window !== 'undefined';

// Helper function to get authentication token
const getAuthToken = (): string | null => {
  if (!isBrowser) return null;
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  // Make sure we're returning proper authorization header with Bearer token
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Initialize local storage data or use default mocks
const initLocalStorageData = () => {
  if (!isBrowser) return;
  
  // Default mock articles
  const DEFAULT_MOCK_ARTICLES: Article[] = [
    {
      id: '1',
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
      createdAt: new Date(2023, 10, 15).toISOString(),
      updatedAt: new Date(2023, 10, 15).toISOString(),
      category: 'Artificial Intelligence',
      tags: ['AI', 'Machine Learning', 'Technology', 'Future'],
      readTime: 8,
      featured: true,
      views: 1240
    },
    {
      id: '2',
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
      createdAt: new Date(2023, 11, 2).toISOString(),
      updatedAt: new Date(2023, 11, 2).toISOString(),
      category: 'Web Development',
      tags: ['JavaScript', 'React', 'Web Development', 'Frontend'],
      readTime: 6,
      featured: false,
      views: 830
    },
    {
      id: '3',
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
      createdAt: new Date(2023, 11, 10).toISOString(),
      updatedAt: new Date(2023, 11, 10).toISOString(),
      category: 'Cybersecurity',
      tags: ['Security', 'Remote Work', 'VPN', 'Data Protection'],
      readTime: 5,
      featured: false,
      views: 615
    },
    {
      id: '4',
      title: 'The Rise of Quantum Computing: Implications for Cryptography',
      slug: 'quantum-computing-implications-cryptography',
      excerpt: 'How quantum computers will transform cybersecurity and what organizations can do to prepare.',
      content: `
# The Rise of Quantum Computing: Implications for Cryptography

Quantum computing represents a paradigm shift in computational power, with profound implications for cybersecurity and cryptography.

## Understanding Quantum Computing

Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously due to superposition. This allows quantum computers to solve certain problems exponentially faster than classical computers.

## Threat to Current Cryptography

Many current encryption methods rely on mathematical problems that are difficult for classical computers to solve, such as factoring large numbers. Quantum computers, using Shor's algorithm, could potentially break these encryption methods in minutes rather than billions of years.

## Post-Quantum Cryptography

To address this threat, researchers are developing quantum-resistant algorithms. These include:

- Lattice-based cryptography
- Hash-based cryptography
- Code-based cryptography
- Multivariate polynomial cryptography
- Isogeny-based cryptography

## Timeline and Preparedness

While large-scale quantum computers are still years away, organizations should start preparing now:

1. Inventory current cryptographic implementations
2. Develop quantum risk assessment frameworks
3. Monitor NIST's post-quantum cryptography standardization process
4. Implement crypto-agility to facilitate future transitions

The quantum revolution is coming. By understanding the implications and preparing accordingly, organizations can ensure their data remains secure in the post-quantum era.
      `,
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      authorId: '2',
      authorName: 'Jane Smith',
      authorAvatar: 'https://i.pravatar.cc/150?u=jane',
      createdAt: new Date(2023, 11, 20).toISOString(),
      updatedAt: new Date(2023, 11, 20).toISOString(),
      category: 'Quantum Computing',
      tags: ['Quantum', 'Cryptography', 'Security', 'Computing'],
      readTime: 7,
      featured: true,
      views: 925
    }
  ];

  // Default mock comments
  const DEFAULT_MOCK_COMMENTS: Comment[] = [
    {
      id: '1',
      content: 'Great article! I especially appreciated the insights on AI in healthcare.',
      articleId: '1',
      authorId: '2',
      authorName: 'Jane Smith',
      authorAvatar: 'https://i.pravatar.cc/150?u=jane',
      createdAt: new Date(2023, 10, 16).toISOString(),
      updatedAt: new Date(2023, 10, 16).toISOString()
    },
    {
      id: '2',
      content: 'I agree with Jane. The healthcare applications are particularly exciting.',
      articleId: '1',
      authorId: '3',
      authorName: 'Robert Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?u=robert',
      createdAt: new Date(2023, 10, 17).toISOString(),
      updatedAt: new Date(2023, 10, 17).toISOString()
    },
    {
      id: '3',
      content: 'Have you considered the ethical implications of AI in autonomous vehicles?',
      articleId: '1',
      authorId: '4',
      authorName: 'Emily Chen',
      authorAvatar: 'https://i.pravatar.cc/150?u=emily',
      createdAt: new Date(2023, 10, 18).toISOString(),
      updatedAt: new Date(2023, 10, 18).toISOString()
    }
  ];

  // Check if articles exist in localStorage
  if (!localStorage.getItem('mock_articles')) {
    localStorage.setItem('mock_articles', JSON.stringify(DEFAULT_MOCK_ARTICLES));
  }

  // Check if comments exist in localStorage
  if (!localStorage.getItem('mock_comments')) {
    localStorage.setItem('mock_comments', JSON.stringify(DEFAULT_MOCK_COMMENTS));
  }
};

// Initialize localStorage on module load, safely
if (isBrowser) {
  try {
    initLocalStorageData();
  } catch (error) {
    console.error('Error initializing local storage data:', error);
  }
}

// Helper functions to get and set data in localStorage
const getMockArticles = (): Article[] => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(localStorage.getItem('mock_articles') || '[]');
  } catch (error) {
    console.error('Error getting mock articles:', error);
    return [];
  }
};

const setMockArticles = (articles: Article[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('mock_articles', JSON.stringify(articles));
  } catch (error) {
    console.error('Error setting mock articles:', error);
  }
};

const getMockComments = (): Comment[] => {
  if (!isBrowser) return [];
  try {
    return JSON.parse(localStorage.getItem('mock_comments') || '[]');
  } catch (error) {
    console.error('Error getting mock comments:', error);
    return [];
  }
};

const setMockComments = (comments: Comment[]): void => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('mock_comments', JSON.stringify(comments));
  } catch (error) {
    console.error('Error setting mock comments:', error);
  }
};

// Utility function to generate a slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// Utility function to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Utility function to calculate read time based on content length
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Utility function to format dates
export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// API base URL - check for API URL
const API_BASE_URL = ''; // Use relative path instead of hardcoded 'http://localhost:3000'

// Set to true to use mock data instead of making API calls
const USE_MOCK_DATA = true;

// Function to get all blog posts with filtering options
export const getArticles = async (options: {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
} = {}) => {
  if (USE_MOCK_DATA) {
    // Use mock data with error handling
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let articles = getMockArticles();
      if (!articles || !articles.length) {
        console.warn('No mock articles available, check localStorage or initialization');
        return [];
      }
      
      // Apply filters
      if (options.category) {
        articles = articles.filter(article => 
          article.category.toLowerCase() === options.category?.toLowerCase()
        );
      }
      
      if (options.tag) {
        articles = articles.filter(article => 
          article.tags.some(tag => tag.toLowerCase() === options.tag?.toLowerCase())
        );
      }
      
      if (options.featured !== undefined) {
        articles = articles.filter(article => article.featured === options.featured);
      }
      
      // Sort articles
      const sortField = options.sort || 'createdAt';
      const sortOrder = options.order === 'asc' ? 1 : -1;
      
      articles.sort((a, b) => {
        if (sortField === 'createdAt') {
          return sortOrder * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
      
      // Apply pagination
      const page = options.page || 1;
      const limit = options.limit || articles.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return articles.slice(startIndex, endIndex);
    } catch (error) {
      console.error('Error using mock article data:', error);
      return [];
    }
  }
  
  try {
    // Build query string from options
    const queryParams = new URLSearchParams();
    
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.page) queryParams.append('page', options.page.toString());
    if (options.category) queryParams.append('category', options.category);
    if (options.tag) queryParams.append('tag', options.tag);
    if (options.featured !== undefined) queryParams.append('featured', options.featured.toString());
    if (options.sort) queryParams.append('sort', options.sort);
    if (options.order) queryParams.append('order', options.order);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    // Make API request
    const response = await axios.get(`${API_BASE_URL}/api/blog${queryString}`);
    
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    if (isBrowser) {
      toast.error('Failed to fetch blog posts');
    }
    return [];
  }
};

// Function to get a single blog post by slug
export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const articles = getMockArticles();
    const article = articles.find(article => article.slug === slug);
    
    if (article) {
      // Increment views
      const updatedArticle = { ...article, views: article.views + 1 };
      setMockArticles(articles.map(a => a.id === article.id ? updatedArticle : a));
      return updatedArticle;
    }
    
    return null;
  }
  
  try {
    if (!slug) {
      console.error('getArticleBySlug called with empty slug');
      return null;
    }
    
    console.log(`Fetching article with slug: ${slug}`);
    const response = await axios.get(`${API_BASE_URL}/api/blog/${slug}`);
    console.log('API response:', response.status, response.statusText);
    
    // Make sure we have data and it has the right shape
    if (!response.data) {
      console.error('API returned empty response for slug:', slug);
      return null;
    }
    
    // If response.data doesn't have the expected fields, try a different property
    const article = response.data;
    
    // Log the article for debugging
    console.log('Received article:', {
      id: article.id || article._id,
      title: article.title,
      slug: article.slug
    });
    
    return article;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received for request:', error.request);
      }
    }
    
    toast.error('Failed to fetch blog post');
    return null;
  }
};

// Function to create a new blog post
export const createArticle = async (articleData: Omit<Article, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'readTime' | 'views'>): Promise<Article> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const now = new Date().toISOString();
    const newArticle: Article = {
      id: generateId(),
      slug: generateSlug(articleData.title),
      createdAt: now,
      updatedAt: now,
      readTime: calculateReadTime(articleData.content),
      views: 0,
      ...articleData
    };
    
    const articles = getMockArticles();
    articles.push(newArticle);
    setMockArticles(articles);
    
    toast.success('Blog post created successfully');
    return newArticle;
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to create a blog post');
      throw new Error('Authentication required');
    }
    
    console.log('Creating article with auth headers:', {
      headers: getAuthHeaders()
    });
    
    const response = await axios.post(`${API_BASE_URL}/api/blog`, articleData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    
    toast.success('Blog post created successfully');
    return response.data;
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    
    // More detailed error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.error || 'Failed to create blog post';
      toast.error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error(`Error: ${error.message}`);
    }
    
    throw error;
  }
};

// Function to update an existing blog post
export const updateArticle = async (id: string, articleData: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | null> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const articles = getMockArticles();
    const articleIndex = articles.findIndex(article => article.id === id);
    
    if (articleIndex === -1) {
      toast.error('Blog post not found');
      return null;
    }
    
    // Generate new slug if title was updated
    let updatedSlug = articles[articleIndex].slug;
    if (articleData.title) {
      updatedSlug = generateSlug(articleData.title);
    }
    
    // Calculate new readTime if content was updated
    let updatedReadTime = articles[articleIndex].readTime;
    if (articleData.content) {
      updatedReadTime = calculateReadTime(articleData.content);
    }
    
    // Update the article
    const updatedArticle: Article = {
      ...articles[articleIndex],
      ...articleData,
      slug: updatedSlug,
      readTime: updatedReadTime,
      updatedAt: new Date().toISOString()
    };
    
    articles[articleIndex] = updatedArticle;
    setMockArticles(articles);
    
    toast.success('Blog post updated successfully');
    return updatedArticle;
  }
  
  try {
    // First fetch the blog post to get its slug
    const response = await axios.get(`${API_BASE_URL}/api/blog/${articleData.slug || id}`, {
      headers: { ...getAuthHeaders() }
    });
    const blogPost = response.data;
    
    // Use the existing slug for the update
    const updateResponse = await axios.put(`${API_BASE_URL}/api/blog/${blogPost.slug}`, articleData, {
      headers: { ...getAuthHeaders() }
    });
    
    toast.success('Blog post updated successfully');
    return updateResponse.data;
  } catch (error) {
    console.error('Error updating blog post:', error);
    toast.error('Failed to update blog post');
    return null;
  }
};

// Function to delete a blog post
export const deleteArticle = async (slug: string): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const articles = getMockArticles();
    const articleIndex = articles.findIndex(article => article.slug === slug);
    
    if (articleIndex === -1) {
      toast.error('Blog post not found');
      return false;
    }
    
    const articleId = articles[articleIndex].id;
    
    // Remove article
    articles.splice(articleIndex, 1);
    setMockArticles(articles);
    
    // Also remove any comments for this article
    const comments = getMockComments();
    const updatedComments = comments.filter(comment => comment.articleId !== articleId);
    setMockComments(updatedComments);
    
    toast.success('Blog post deleted successfully');
    return true;
  }
  
  try {
    await axios.delete(`${API_BASE_URL}/api/blog/${slug}`, {
      headers: { ...getAuthHeaders() }
    });
    toast.success('Blog post deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    toast.error('Failed to delete blog post');
    return false;
  }
};

// COMMENTS API FUNCTIONS

// Function to get comments for a blog post
export const getCommentsByArticleId = async (articleId: string): Promise<Comment[]> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const comments = getMockComments();
    return comments.filter(comment => comment.articleId === articleId);
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/api/comments?articleId=${articleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    toast.error('Failed to fetch comments');
    return [];
  }
};

// Function to create a new comment
export const createComment = async (commentData: {
  articleId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentId?: string;
}): Promise<Comment> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      ...commentData
    };
    
    const comments = getMockComments();
    comments.push(newComment);
    setMockComments(comments);
    
    toast.success('Comment posted successfully');
    return newComment;
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to post a comment');
      throw new Error('Authentication required');
    }
    
    console.log('Posting comment with auth token');
    
    const response = await axios.post(`${API_BASE_URL}/api/comments`, commentData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    
    toast.success('Comment posted successfully');
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    
    // Provide more specific error messages
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with an error status code
        const errorMessage = error.response.data?.error || 'Failed to post comment';
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Error occurred during request setup
        toast.error(`Error: ${error.message}`);
      }
    } else {
      toast.error('Failed to post comment');
    }
    
    throw error;
  }
};

// Function to delete a comment
export const deleteComment = async (commentId: string): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const comments = getMockComments();
    const commentIndex = comments.findIndex(comment => comment.id === commentId);
    
    if (commentIndex === -1) {
      toast.error('Comment not found');
      return false;
    }
    
    comments.splice(commentIndex, 1);
    setMockComments(comments);
    
    toast.success('Comment deleted successfully');
    return true;
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to delete comments');
      return false;
    }
    
    await axios.delete(`${API_BASE_URL}/api/comments/${commentId}`, {
      headers: { ...getAuthHeaders() }
    });
    toast.success('Comment deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      toast.error('You do not have permission to delete this comment');
    } else {
      toast.error('Failed to delete comment');
    }
    return false;
  }
};

// User Management Functions
export type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DEFAULT' | 'MANAGER';
  avatar?: string;
  bio?: string;
  createdAt: string;
};

// Function to get all users (for ADMIN users)
export const getAllUsers = async (): Promise<UserData[]> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Return a list of mock users
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN',
        avatar: 'https://i.pravatar.cc/150?u=john',
        createdAt: new Date(2023, 1, 1).toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'MANAGER',
        avatar: 'https://i.pravatar.cc/150?u=jane',
        createdAt: new Date(2023, 2, 15).toISOString()
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'DEFAULT',
        avatar: 'https://i.pravatar.cc/150?u=bob',
        createdAt: new Date(2023, 3, 20).toISOString()
      }
    ];
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to access user data');
      return [];
    }
    
    const response = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: { ...getAuthHeaders() }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      toast.error('You do not have permission to access user data');
    } else {
      toast.error('Failed to fetch users');
    }
    return [];
  }
};

// Function to update a user's role (for ADMIN users)
export const updateUserRole = async (userId: string, role: 'ADMIN' | 'DEFAULT' | 'MANAGER'): Promise<UserData | null> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Return a mock updated user
    return {
      id: userId,
      name: 'Updated User',
      email: 'user@example.com',
      role,
      avatar: 'https://i.pravatar.cc/150?u=updated',
      createdAt: new Date().toISOString()
    };
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to update user roles');
      return null;
    }
    
    const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, 
      { role },
      { headers: { ...getAuthHeaders() } }
    );
    
    toast.success(`User role updated to ${role}`);
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      toast.error('You do not have permission to update user roles');
    } else {
      toast.error('Failed to update user role');
    }
    return null;
  }
};

// Function to get all user IDs (for MANAGER and ADMIN roles)
export const getAllUserIds = async (): Promise<{id: string, name: string}[]> => {
  if (USE_MOCK_DATA) {
    // Use mock data
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Return a list of mock users with only IDs and names
    return [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Smith' },
      { id: '3', name: 'Bob Johnson' }
    ];
  }
  
  try {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to access user data');
      return [];
    }
    
    const response = await axios.get(`${API_BASE_URL}/api/users`, {
      headers: { ...getAuthHeaders() }
    });
    
    // Extract only the id and name fields from each user
    return response.data.map((user: UserData) => ({
      id: user.id,
      name: user.name
    }));
  } catch (error) {
    console.error('Error fetching user IDs:', error);
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      toast.error('You do not have permission to access user data');
    } else {
      toast.error('Failed to fetch user data');
    }
    return [];
  }
};
