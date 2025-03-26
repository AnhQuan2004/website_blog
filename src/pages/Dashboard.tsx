
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getArticles, deleteArticle, Article } from '@/utils/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil, Trash2, Eye, Plus, ShieldCheck } from 'lucide-react';
import { formatDate } from '@/utils/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'my-articles' | 'all-articles'>('my-articles');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // Fetch user's articles
    fetchUserArticles();
    
    // Fetch all articles if admin
    if (isAdmin) {
      fetchAllArticles();
    }
  }, [isAuthenticated, navigate, isAdmin]);

  const fetchUserArticles = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const allArticles = await getArticles();
      const userArticles = allArticles.filter(article => article.authorId === user.id);
      setArticles(userArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load your articles');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllArticles = async () => {
    setIsLoading(true);
    try {
      const articles = await getArticles();
      setAllArticles(articles);
    } catch (error) {
      console.error('Error fetching all articles:', error);
      toast.error('Failed to load all articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteArticle(articleId);
      // Refresh the article list
      fetchUserArticles();
      if (isAdmin) {
        fetchAllArticles();
      }
      toast.success('Article deleted successfully');
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const displayedArticles = viewMode === 'my-articles' ? articles : allArticles;

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Manage all articles and your account" 
              : "Manage your articles and account"}
          </p>
          {isAdmin && (
            <div className="mt-2 inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              <ShieldCheck size={12} className="mr-1" />
              Admin Account
            </div>
          )}
        </div>
        <Button asChild>
          <Link to="/create-article" className="flex items-center gap-2">
            <Plus size={16} />
            Create New Article
          </Link>
        </Button>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'my-articles'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => setViewMode('my-articles')}
            >
              My Articles
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'all-articles'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => setViewMode('all-articles')}
            >
              All Articles
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {viewMode === 'my-articles' ? 'Your Articles' : 'All Articles'}
            </CardTitle>
            <CardDescription>
              {displayedArticles.length === 0 
                ? viewMode === 'my-articles' 
                  ? "You haven't published any articles yet." 
                  : "No articles have been published yet."
                : `${viewMode === 'my-articles' ? 'You have' : 'There are'} ${displayedArticles.length} article${displayedArticles.length !== 1 ? 's' : ''}.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            ) : displayedArticles.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4">
                  {viewMode === 'my-articles' 
                    ? "Start sharing your knowledge with the world!" 
                    : "No articles have been published yet."}
                </p>
                {viewMode === 'my-articles' && (
                  <Button asChild>
                    <Link to="/create-article">Create Your First Article</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedArticles.map((article) => (
                  <React.Fragment key={article.id}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{article.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            {article.category}
                          </span>
                          {viewMode === 'all-articles' && article.authorId !== user?.id && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              By {article.authorName}
                            </span>
                          )}
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
                        {(user?.id === article.authorId || isAdmin) && (
                          <>
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/edit-article/${article.slug}`}>
                                <Pencil size={16} className="mr-1" /> Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:bg-destructive hover:text-white"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                          </>
                        )}
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
    </div>
  );
};

export default Dashboard;
