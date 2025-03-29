'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/lib/mongodb/blog';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);

        // Update metadata
        document.title = `${data.title} | xmatch.pro Blog`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', data.content_raw.slice(0, 160));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.slug]);

  if (isLoading) {
    return <BlogPostSkeleton />;
  }

  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-6">
        <Button
          variant="ghost"
          className="group hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto p-8">
        <article className="prose dark:prose-invert lg:prose-lg mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <time dateTime={post.publish_date.toString()}>
                {formatDate(post.publish_date)}
              </time>
              <span>•</span>
              <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
                {post.category}
              </span>
            </div>
          </header>

          <div 
            className="mt-8 prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-red-600 hover:prose-a:text-red-500 prose-strong:text-foreground prose-code:text-red-600 prose-pre:bg-muted prose-pre:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <footer className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {post.keywords.split(',').map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full text-sm text-red-600 dark:text-red-400"
                >
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </Card>
    </div>
  );
}

function BlogPostSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </Card>
    </div>
  );
}