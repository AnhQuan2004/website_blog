import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getAllUserIds, 
  getArticles, 
  deleteArticle, 
  Article, 
  formatDate 
} from '@/utils/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, Filter } from 'lucide-react';

const BlogManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | 'all'>('all');
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Redirect if not authenticated or not allowed
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (user?.role !== 'ADMIN' && user?.role !== 'MANAGER') {
      navigate('/', { replace: true });
      toast.error('You do not have permission to access this page');
      return;
    }

    fetchUsers();
    fetchArticles();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      const userList = await getAllUserIds();
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const allArticles = await getArticles();
      setArticles(allArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteArticle(slug);
      // Refresh the article list
      fetchArticles();
      toast.success('Article deleted successfully');
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'MANAGER')) {
    return null; // Will redirect in useEffect
  }

  // Filter articles by selected user if not "all"
  const filteredArticles = selectedUserId === 'all' 
    ? articles 
    : articles.filter(article => article.authorId === selectedUserId);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all blog posts in the system
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <Select
              value={selectedUserId}
              onValueChange={(value) => setSelectedUserId(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link to="/create-post">Create New Post</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            {filteredArticles.length === 0 
              ? "No blog posts found." 
              : `${filteredArticles.length} post${filteredArticles.length !== 1 ? 's' : ''} in the system.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <React.Fragment key={article.id}>
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{article.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          By {article.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Published {formatDate(article.createdAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end md:self-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/article/${article.slug}`}>
                          <Eye size={16} className="mr-1" /> View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/edit-post/${article.slug}`}>
                          <Pencil size={16} className="mr-1" /> Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-white"
                        onClick={() => handleDeleteArticle(article.slug)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement; 