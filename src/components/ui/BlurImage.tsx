
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type BlurImageProps = {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
};

const BlurImage: React.FC<BlurImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : '');

  useEffect(() => {
    if (!priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoading(false);
      };
    }
  }, [src, priority]);

  return (
    <div className={cn('overflow-hidden relative', containerClassName)}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
      {currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={cn(
            'transition-opacity duration-500 ease-in-out w-full h-full object-cover',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
        />
      )}
    </div>
  );
};

export default BlurImage;
