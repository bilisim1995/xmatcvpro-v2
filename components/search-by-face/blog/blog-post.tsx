'use client';

import { Tag } from 'lucide-react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  tags: string[];
  footer?: React.ReactNode;
}

export function BlogPost({ title, excerpt, tags, footer }: BlogPostProps) {
  return (
    <article className="group relative py-6">
      <div className="absolute -inset-y-2 -inset-x-4 group-hover:bg-muted/50 rounded-xl transition-all duration-300" />
      <div className="relative p-4">
        <h2 className="text-xl font-semibold mb-2">
          {title}
        </h2>
        
        <p className="text-muted-foreground mb-4">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}