import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlurImage from '@/components/ui/BlurImage';
import { formatDate } from '@/utils/api';
import type { Article } from '@/utils/api';

interface FeaturedBlogPostProps {
  blogPost: Article;
}

const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({ blogPost }) => {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center rounded-lg overflow-hidden group">
      <div>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
            {blogPost.category}
          </span>
          <span className="bg-muted text-xs font-medium px-3 py-1 rounded-full flex items-center">
            <Clock size={12} className="mr-1" />
            {blogPost.readTime} min read
          </span>
          <span className="bg-muted text-xs font-medium px-3 py-1 rounded-full flex items-center">
            <Calendar size={12} className="mr-1" />
            {formatDate(blogPost.createdAt)}
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          {blogPost.title}
        </h2>

        <p className="text-muted-foreground mb-6">
          {blogPost.excerpt}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={blogPost.authorAvatar || "https://i.pravatar.cc/150"}
            alt={blogPost.authorName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{blogPost.authorName}</p>
            <p className="text-sm text-muted-foreground">
              Published {formatDate(blogPost.createdAt)}
            </p>
          </div>
        </div>

        <Button asChild className="group">
          <Link to={`/blog/${blogPost.slug}`} className="flex items-center gap-1">
            Read More
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      <div className="relative h-[300px] lg:h-[400px] rounded-lg overflow-hidden order-first lg:order-last">
        <BlurImage
          src={blogPost.coverImage}
          alt={blogPost.title}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>
    </div>
  );
};

export default FeaturedBlogPost; 