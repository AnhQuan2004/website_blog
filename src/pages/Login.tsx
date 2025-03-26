
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      // Error is handled by the AuthContext
    }
  };

  const setDemoCredentials = (role: 'admin' | 'author') => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@example.com',
        password: 'admin123',
      });
    } else {
      setFormData({
        email: 'jane@example.com',
        password: 'password',
      });
    }
  };
  
  return (
    <div className="min-h-screen py-16 flex items-center justify-center">
      <div className="bg-background w-full max-w-md p-8 rounded-lg shadow-sm border border-border animate-fade-in">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="text-xl font-bold tracking-tight flex items-center justify-center mb-8"
          >
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded mr-1">Tech</span>
            <span>Tales</span>
          </Link>
          
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                to="/forgot-password" 
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>
        
        {/* Test Account Info */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <Info size={16} className="text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-1">Test Accounts</h3>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div>
                  <div className="mb-1">
                    <strong>Admin Account:</strong> admin@example.com / admin123
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setDemoCredentials('admin')}
                  >
                    Use Admin Credentials
                  </Button>
                </div>
                <div>
                  <div className="mb-1">
                    <strong>Author Account:</strong> jane@example.com / password
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => setDemoCredentials('author')}
                  >
                    Use Author Credentials
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative my-8">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
              <path d="M6.44 14.08l7.227-7.227 2.587 2.58-7.227 7.227-2.587-2.58z" fill="#34A853"/>
              <path d="M14.827 14.08l-1.24 1.24L6.44 8.174l1.24-1.24 7.147 7.147z" fill="#FBBC05"/>
              <path d="M15.314 8.174l-1.24 1.24-7.147-7.147 1.24-1.24 7.147 7.147z" fill="#EA4335"/>
            </svg>
            Google
          </Button>
          <Button variant="outline" type="button" className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="#1877F2"/>
            </svg>
            Facebook
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        
        <Button 
          variant="ghost" 
          className="mt-4 w-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default Login;
