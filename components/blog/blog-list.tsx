'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/mongodb/blog';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    setPage(1);
    setRetryCount(0);
    fetchPosts();
  }, [category]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (retryCount >= MAX_RETRIES) {
        throw new Error('Maximum retry attempts reached');
      }

      const url = new URL('/api/blog', window.location.origin);
      url.searchParams.set('page', page.toString());
      if (category) {
        url.searchParams.set('category', category);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        if (response.status === 500 && retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          fetchPosts();
          return;
        }
        throw new Error(`Failed to fetch posts (${response.status})`);
      }
      
      const data = await response.json();
      if (!data.posts || !Array.isArray(data.posts)) {
        throw new Error('Invalid response format');
      }
      
      if (!data.posts.length && page > 1) {
        setPage(1);
        return;
      }
      
      setPosts(data.posts);
      setTotalPages(data.pagination.pages);

    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load blog posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <BlogListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Link key={post._id} href={`/blog/${post.slug}`}>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <article className="space-y-4">
              <h2 className="text-2xl font-bold mb-2 hover:text-red-600 transition-colors">
                {post.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <time dateTime={post.publish_date.toString()}>
                  {formatDate(new Date(post.publish_date))}
                </time>
                <span>•</span>
                <span>{post.category}</span>
              </div>
              <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                {post.content_raw}
              </p>
              <div className="flex flex-wrap gap-2 pt-4">
                {post.keywords.split(',').map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                  >
                    {keyword.trim()}
                  </span>
                ))}
              </div>
            </article>
          </Card>
        </Link>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="flex gap-4">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}