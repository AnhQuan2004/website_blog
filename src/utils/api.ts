// Mock data for initial development
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

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
  content: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  parentId?: string;
};

// Initialize local storage data or use default mocks
const initLocalStorageData = () => {
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
      createdAt: new Date(2023, 10, 16).toISOString()
    },
    {
      id: '2',
      content: 'I agree with Jane. The healthcare applications are particularly exciting.',
      articleId: '1',
      authorId: '3',
      authorName: 'Robert Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?u=robert',
      createdAt: new Date(2023, 10, 17).toISOString()
    },
    {
      id: '3',
      content: 'Have you considered the ethical implications of AI in autonomous vehicles?',
      articleId: '1',
      authorId: '4',
      authorName: 'Emily Chen',
      authorAvatar: 'https://i.pravatar.cc/150?u=emily',
      createdAt: new Date(2023, 10, 18).toISOString()
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

// Initialize localStorage on module load
initLocalStorageData();

// Helper functions to get and set data in localStorage
const getMockArticles = (): Article[] => {
  return JSON.parse(localStorage.getItem('mock_articles') || '[]');
};

const setMockArticles = (articles: Article[]): void => {
  localStorage.setItem('mock_articles', JSON.stringify(articles));
};

const getMockComments = (): Comment[] => {
  return JSON.parse(localStorage.getItem('mock_comments') || '[]');
};

const setMockComments = (comments: Comment[]): void => {
  localStorage.setItem('mock_comments', JSON.stringify(comments));
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

// API functions for articles
export const getArticles = async (params: { featured?: boolean; limit?: number; category?: string; tag?: string } = {}): Promise<Article[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let articles = getMockArticles();
  
  // Filter featured articles if requested
  if (params.featured !== undefined) {
    articles = articles.filter(article => article.featured === params.featured);
  }

  // Filter by category if provided
  if (params.category) {
    articles = articles.filter(article => 
      article.category.toLowerCase() === params.category?.toLowerCase()
    );
  }

  // Filter by tag if provided
  if (params.tag) {
    articles = articles.filter(article => 
      article.tags.some(tag => tag.toLowerCase() === params.tag?.toLowerCase())
    );
  }
  
  // Sort by date (newest first)
  articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Limit results if requested
  if (params.limit) {
    articles = articles.slice(0, params.limit);
  }
  
  return articles;
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const articles = getMockArticles();
  const article = articles.find(article => article.slug === slug);
  return article || null;
};

export const createArticle = async (articleData: Omit<Article, 'id' | 'slug' | 'createdAt' | 'updatedAt' | 'readTime' | 'views'>): Promise<Article> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
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
  
  // Add to mock database
  const articles = getMockArticles();
  articles.push(newArticle);
  setMockArticles(articles);
  
  toast.success('Article created successfully');
  return newArticle;
};

export const updateArticle = async (id: string, articleData: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const articles = getMockArticles();
  const articleIndex = articles.findIndex(article => article.id === id);
  
  if (articleIndex === -1) {
    toast.error('Article not found');
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
  
  toast.success('Article updated successfully');
  return updatedArticle;
};

export const deleteArticle = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const articles = getMockArticles();
  const articleIndex = articles.findIndex(article => article.id === id);
  
  if (articleIndex === -1) {
    toast.error('Article not found');
    return false;
  }
  
  // Remove article from mock database
  articles.splice(articleIndex, 1);
  setMockArticles(articles);
  
  // Also remove any comments associated with this article
  const comments = getMockComments();
  const commentIndicesToRemove = comments
    .map((comment, index) => comment.articleId === id ? index : -1)
    .filter(index => index !== -1)
    .sort((a, b) => b - a); // Sort in descending order to remove from the end first
  
  commentIndicesToRemove.forEach(index => comments.splice(index, 1));
  setMockComments(comments);
  
  toast.success('Article deleted successfully');
  return true;
};

// API functions for comments
export const getCommentsByArticleId = async (articleId: string): Promise<Comment[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const comments = getMockComments();
  return comments.filter(comment => comment.articleId === articleId);
};

export const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newComment: Comment = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...commentData
  };
  
  // Add to mock database
  const comments = getMockComments();
  comments.push(newComment);
  setMockComments(comments);
  
  toast.success('Comment added successfully');
  return newComment;
};

export const updateComment = async (id: string, content: string): Promise<Comment | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const comments = getMockComments();
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    toast.error('Comment not found');
    return null;
  }
  
  // Update the comment
  comments[commentIndex] = {
    ...comments[commentIndex],
    content
  };
  
  setMockComments(comments);
  
  toast.success('Comment updated successfully');
  return comments[commentIndex];
};

export const deleteComment = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const comments = getMockComments();
  const commentIndex = comments.findIndex(comment => comment.id === id);
  
  if (commentIndex === -1) {
    toast.error('Comment not found');
    return false;
  }
  
  // Remove comment from mock database
  comments.splice(commentIndex, 1);
  setMockComments(comments);
  
  toast.success('Comment deleted successfully');
  return true;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
