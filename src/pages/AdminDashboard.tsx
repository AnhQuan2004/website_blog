import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { formatDate } from '@/utils/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersData, articlesData] = await Promise.all([
          getAllUsers(),
          getArticles({ limit: 1000 }) // Get all articles for stats
        ]);
        
        setUsers(usersData);
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    totalPosts: articles.length,
    totalViews: articles.reduce((sum, article) => sum + article.views, 0),
    adminUsers: users.filter(u => u.role === 'ADMIN').length,
    managerUsers: users.filter(u => u.role === 'MANAGER').length,
    defaultUsers: users.filter(u => u.role === 'DEFAULT').length,
    categoryCounts: articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentUsers: [...users].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5),
    popularPosts: [...articles].sort((a, b) => b.views - a.views).slice(0, 5),
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}. Manage your website here.
          </p>
          <div className="mt-2 inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            <Shield size={12} className="mr-1" />
            Admin Access
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to="/">
              <Home size={16} className="mr-1" /> View Site
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/user-management">
              <Users size={16} className="mr-1" /> User Management
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/blog-management">
              <FileText size={16} className="mr-1" /> Content Management
            </Link>
          </Button>
          <Button asChild>
            <Link to="/create-post">
              <FileText size={16} className="mr-1" /> Create New Post
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart size={16} className="mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users size={16} className="mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText size={16} className="mr-2" /> Content
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings size={16} className="mr-2" /> Settings
          </TabsTrigger>
        </TabsList>
        
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
                  {stats.adminUsers} admins, {stats.managerUsers} managers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {Object.keys(stats.categoryCounts).length} categories
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
                  {Math.round(stats.totalViews / stats.totalPosts)} avg per post
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(stats.categoryCounts).length}</div>
                <p className="text-xs text-muted-foreground">
                  {Object.entries(stats.categoryCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 2)
                    .map(([cat]) => cat)
                    .join(', ')} most common
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Last {Math.min(5, stats.recentUsers.length)} users who joined
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentUsers.map(userData => (
                    <div key={userData.id} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center mr-3">
                        {userData.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="text-sm font-medium">{userData.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {userData.email} · {formatDate(userData.createdAt)}
                        </div>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded-full">
                        {userData.role}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Popular Content</CardTitle>
                <CardDescription>
                  Top {Math.min(5, stats.popularPosts.length)} most viewed posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.popularPosts.map(post => (
                    <div key={post.id} className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center mr-3">
                        <Star className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="text-sm font-medium truncate" title={post.title}>
                          {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.category} · by {post.authorName}
                        </div>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded-full">
                        {post.views} views
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="mb-4">Go to the full user management page to manage user accounts.</p>
                <Button asChild>
                  <Link to="/user-management">
                    User Management
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage all blog posts and content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="mb-4">Go to the full content management page to manage blog posts.</p>
                <div className="flex justify-center gap-3">
                  <Button asChild>
                    <Link to="/blog-management">
                      Blog Management
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/create-post">
                      Create New Post
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure your website settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p>Settings functionality coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 