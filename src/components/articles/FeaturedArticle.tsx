
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlurImage from '../ui/BlurImage';
import { formatDate } from '@/utils/api';
import type { Article } from '@/utils/api';

type FeaturedArticleProps = {
  article: Article;
};

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-8 glass-card rounded-xl lg:rounded-2xl p-6 lg:p-10 animate-fade-in">
      <div className="lg:w-1/2 aspect-[16/9] rounded-xl overflow-hidden">
        <BlurImage
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      </div>
      
      <div className="lg:w-1/2 space-y-4 lg:space-y-6">
        <div>
          <div className="flex items-center space-x-3 mb-3">
            <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-muted-foreground text-sm flex items-center">
              <Clock size={14} className="mr-1" />
              {article.readTime} min read
            </span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-3">
            {article.title}
          </h2>
          
          <p className="text-muted-foreground lg:text-lg">
            {article.excerpt}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <img
            src={article.authorAvatar || 'https://i.pravatar.cc/150'}
            alt={article.authorName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{article.authorName}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(article.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <Link to={`/article/${article.slug}`}>
            <Button className="group">
              Read article
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
