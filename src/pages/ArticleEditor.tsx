import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { getArticleBySlug, createArticle, updateArticle } from '@/utils/api';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import MarkdownUploader from '@/components/articles/MarkdownUploader';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url('Must be a valid URL'),
  category: z.string().min(2, 'Category is required'),
  tags: z.string().min(2, 'At least one tag is required'),
  featured: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ArticleEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      coverImage: '',
      category: '',
      tags: '',
      featured: false,
    },
  });

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      toast.error('You must be logged in to edit articles');
      navigate('/login', { replace: true });
      return;
    }

    // If slug is provided, fetch the article for editing
    if (slug) {
      setIsEditing(true);
      fetchArticle();
    }
  }, [slug, isAuthenticated, navigate]);

  const fetchArticle = async () => {
    setIsLoading(true);
    try {
      const article = await getArticleBySlug(slug!);
      if (article) {
        setArticleId(article.id);
        form.reset({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          coverImage: article.coverImage,
          category: article.category,
          tags: article.tags.join(', '),
          featured: article.featured,
        });
      } else {
        toast.error('Article not found');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Error loading article');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to publish articles');
      return;
    }

    setIsLoading(true);
    
    try {
      const tagsArray = values.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (isEditing && articleId) {
        // Update existing article
        await updateArticle(articleId, {
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          coverImage: values.coverImage,
          category: values.category,
          tags: tagsArray,
          featured: values.featured || false,
        });
        navigate(`/article/${slug}`, { replace: true });
      } else {
        // Create new article
        const newArticle = await createArticle({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          coverImage: values.coverImage,
          category: values.category,
          tags: tagsArray,
          featured: values.featured || false,
          authorId: user.id,
          authorName: user.name,
          authorAvatar: user.avatar,
        });
        navigate(`/article/${newArticle.slug}`, { replace: true });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Error saving your article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkdownLoaded = (data: { title?: string; content: string }) => {
    // Update the form with the loaded markdown content
    form.setValue('content', data.content);
    
    // If title was extracted from the markdown, set it as well
    if (data.title) {
      form.setValue('title', data.title);
    }
    
    // Set focus on the excerpt field to encourage the user to fill in the remaining details
    setTimeout(() => {
      const excerptField = document.querySelector('textarea[name="excerpt"]');
      if (excerptField instanceof HTMLTextAreaElement) {
        excerptField.focus();
      }
    }, 100);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update your article with the latest content' : 'Share your knowledge with the world'}
          </p>
        </CardHeader>
        <CardContent>
          {!isEditing && (
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-2">Quick Start</h2>
              <MarkdownUploader onContentLoaded={handleMarkdownLoaded} />
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief summary of your article" 
                        {...field} 
                        className="h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your article content (Markdown supported)" 
                        {...field} 
                        className="min-h-[300px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React, JavaScript, Web" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Article</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        This article will be displayed prominently on the homepage
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading 
                    ? isEditing ? 'Updating...' : 'Publishing...' 
                    : isEditing ? 'Update Article' : 'Publish Article'
                  }
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleEditor;
