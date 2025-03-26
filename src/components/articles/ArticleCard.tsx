
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import BlurImage from '../ui/BlurImage';
import { formatDate } from '@/utils/api';
import type { Article } from '@/utils/api';

type ArticleCardProps = {
  article: Article;
  className?: string;
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, className }) => {
  return (
    <Link 
      to={`/article/${article.slug}`} 
      className={cn(
        'group flex flex-col bg-background rounded-lg overflow-hidden border border-border hover:shadow-md transition-all duration-300 h-full hover-lift',
        className
      )}
    >
      <div className="relative aspect-[16/9]">
        <BlurImage
          src={article.coverImage}
          alt={article.title}
          className="object-cover"
          containerClassName="w-full h-full"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-block bg-primary/10 backdrop-blur-sm text-primary text-xs font-medium px-2 py-1 rounded-full">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="text-xl font-medium line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
          {article.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <img
              src={article.authorAvatar || 'https://i.pravatar.cc/150'}
              alt={article.authorName}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{article.authorName}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {article.readTime} min
            </span>
            <span className="flex items-center">
              <Eye size={14} className="mr-1" />
              {article.views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
