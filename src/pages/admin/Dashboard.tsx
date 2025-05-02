import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllUsers, getArticles, Article, UserData } from '@/utils/api';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Users, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { formatDate } from '@/utils/api';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchData = async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log('Fetching data for admin dashboard...');
      
      // Fetch users and articles in parallel, with mock data enabled
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
      console.error('Error fetching admin dashboard data:', error);
      setHasError(true);
      toast.error('Failed to fetch dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate statistics with safety checks
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
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load dashboard data</h2>
        <p className="text-muted-foreground mb-4">There was an error fetching the required data</p>
        <Button onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your admin dashboard. Here's an overview of your site.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/admin/blog/new">
              <Plus size={16} className="mr-2" /> Create Post
            </Link>
          </Button>
        </div>
      </div>

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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest content updates and user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularPosts.slice(0, 3).map((post, index) => (
                <div key={post.id} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {post.views} views · By {post.authorName}
                    </p>
                  </div>
                </div>
              ))}
              
              {stats.recentUsers.slice(0, 2).map((user) => (
                <div key={user.id} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center mr-3">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">New user: {user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default AdminDashboard; 