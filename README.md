# Blog Website with MongoDB Integration

This project is a full-featured blog website with MongoDB for data storage.

## Features

- Blog post creation, editing, and viewing
- Comments system
- User authentication
- Responsive design
- Markdown support for content
- Categories and tags
- Search functionality

## Tech Stack

- React
- Next.js
- MongoDB
- Express
- Node.js
- Axios
- date-fns
- sonner (toast notifications)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/blog_db
JWT_SECRET=your-secure-jwt-secret-replace-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace these values with your actual MongoDB connection string and a secure JWT secret.

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd website_blog
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:3000

## API Endpoints

### Blog Posts

- `GET /api/blog` - Get all blog posts (supports pagination and filtering)
- `POST /api/blog` - Create a new blog post
- `GET /api/blog/:slug` - Get a single blog post by slug
- `PUT /api/blog/:slug` - Update a blog post
- `DELETE /api/blog/:slug` - Delete a blog post

### Comments

- `GET /api/comments?articleId=<blog-post-id>` - Get all comments for a blog post
- `POST /api/comments` - Create a new comment
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

## MongoDB Data Models

### BlogPost

- title (String, required)
- slug (String, required, unique)
- excerpt (String, required)
- content (String, required)
- coverImage (String, required)
- authorId (String, required)
- authorName (String, required)
- authorAvatar (String)
- category (String, required)
- tags (Array of String)
- readTime (Number)
- featured (Boolean)
- views (Number)
- createdAt (Date)
- updatedAt (Date)

### Comment

- articleId (String, required)
- content (String, required)
- authorId (String, required)
- authorName (String, required)
- authorAvatar (String)
- createdAt (Date)
- updatedAt (Date)

## License

MIT
