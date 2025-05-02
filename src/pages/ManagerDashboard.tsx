import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUsers, getArticles, Article, UserData } from '@/utils/api';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Settings, 
  Users, 
  FileText, 
  MessageSquare,
  Shield,
  Home,
  Star,
  Newspaper,
  TrendingUp,
  Tag,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { formatDate } from '@/utils/api';
import { toast } from 'sonner';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Fetch users and articles in parallel
      const [usersData, articlesData] = await Promise.all([
        getAllUsers(),
        getArticles({ limit: 1000 })
      ]);
      
      if (usersData && Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.warn('User data is not in expected format:', usersData);
        setUsers([]);
      }
      
      if (articlesData && Array.isArray(articlesData)) {
        setArticles(articlesData);
      } else {
        console.warn('Article data is not in expected format:', articlesData);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching manager dashboard data:', error);
      setHasError(true);
      toast.error('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if not authenticated or not allowed
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      navigate('/', { replace: true });
      return;
    }

    fetchData();
  }, [user, navigate]);

  // Calculate statistics - with safety checks
  const stats = {
    totalUsers: users.length,
    totalPosts: articles.length,
    totalViews: articles.reduce((sum, article) => sum + (article.views || 0), 0),
    categoryCounts: articles.reduce((acc, article) => {
      if (article.category) {
        acc[article.category] = (acc[article.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    recentUsers: [...users].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    ).slice(0, 5),
    popularPosts: [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    // Calculate daily traffic (for demonstration)
    dailyTraffic: [
      { date: '2023-09-01', views: 120 },
      { date: '2023-09-02', views: 145 },
      { date: '2023-09-03', views: 132 },
      { date: '2023-09-04', views: 189 },
      { date: '2023-09-05', views: 201 },
      { date: '2023-09-06', views: 178 },
      { date: '2023-09-07', views: 220 },
    ],
  };

  if (isLoading) {
    return (
      <div className="container py-8 mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading manager dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container py-8 mt-16">
        <div className="flex flex-col justify-center items-center h-64">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load dashboard data</h2>
          <p className="text-muted-foreground mb-4">There was an error fetching the required data</p>
          <Button onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}. Manage your website here.
          </p>
          <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            <Shield size={12} className="mr-1" />
            {user?.role} Access
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/">
              <Home size={16} className="mr-1" /> View Site
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <BarChart size={16} className="mr-1" /> Personal Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart size={16} className="mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="traffic">
            <TrendingUp size={16} className="mr-2" /> Traffic
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users size={16} className="mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText size={16} className="mr-2" /> Content
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag size={16} className="mr-2" /> Categories
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentUsers[0]?.name || 'No users'} joined recently
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(stats.categoryCounts).length} different categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPosts ? Math.round(stats.totalViews / stats.totalPosts) : 0} avg per article
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Traffic</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.dailyTraffic.reduce((sum, day) => sum + day.views, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +18% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Content Activity</CardTitle>
                <CardDescription>
                  Recent content performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Content activity chart will appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
                <CardDescription>
                  Top performing categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(stats.categoryCounts).length === 0 ? (
                  <div className="flex items-center justify-center h-[120px]">
                    <p className="text-muted-foreground">No categories found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(stats.categoryCounts)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([category, count], index) => (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mr-2 opacity-80"></div>
                            <span>{category}</span>
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {count} posts
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Visitor traffic over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Traffic analytics chart will appear here</p>
                  <p className="text-sm text-muted-foreground">Showing data for last 30 days</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-semibold mt-1">{stats.totalViews}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">Unique Visitors</p>
                  <p className="text-2xl font-semibold mt-1">{Math.round(stats.totalViews * 0.7)}</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">Avg. Session</p>
                  <p className="text-2xl font-semibold mt-1">3:45</p>
                </div>
                <div className="p-4 bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  <p className="text-2xl font-semibold mt-1">32%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Traffic sources chart will appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Pages</CardTitle>
                <CardDescription>Most viewed pages on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.popularPosts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="text-sm font-medium truncate" title={post.title}>
                          {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.views} views
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts</CardDescription>
              </div>
              <Button asChild>
                <Link to="/user-management">
                  <Users size={16} className="mr-2" /> Full User Management
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="bg-muted/50 p-3 font-medium grid grid-cols-4 gap-4">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Joined</div>
                </div>
                <div className="divide-y">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="grid grid-cols-4 gap-4 p-3">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="truncate text-muted-foreground">{user.email}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' : 
                          user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-muted-foreground">{formatDate(user.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage blog posts and content</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/create-post">
                    <FileText size={16} className="mr-2" /> Create Post
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/blog-management">
                    <Newspaper size={16} className="mr-2" /> Blog Management
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="bg-muted/50 p-3 font-medium grid grid-cols-3 gap-4">
                  <div>Title</div>
                  <div>Author</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {articles.slice(0, 5).map(article => (
                    <div key={article.id} className="grid grid-cols-3 gap-4 p-3">
                      <div className="font-medium truncate">{article.title}</div>
                      <div className="truncate text-muted-foreground">{article.authorName}</div>
                      <div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Published
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Manage content categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Button>
                  <Tag size={16} className="mr-2" /> Add Category
                </Button>
              </div>
              
              <div className="rounded-md border">
                <div className="bg-muted/50 p-3 font-medium grid grid-cols-3 gap-4">
                  <div>Category Name</div>
                  <div>Posts</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y">
                  {Object.entries(stats.categoryCounts)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([category, count]) => (
                      <div key={category} className="grid grid-cols-3 gap-4 p-3">
                        <div className="font-medium">{category}</div>
                        <div>{count} posts</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive hover:text-white">Delete</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManagerDashboard; 