import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { BlogModel } from '@/lib/mongodb/blog';
import { cache } from 'react';

export const revalidate = 60; // Cache for 60 seconds

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const ITEMS_PER_PAGE = 10;

// Cache blog posts
const getBlogPosts = cache(async (query: any, page: number) => {
  const [posts, total] = await Promise.all([
    BlogModel.find(query)
      .sort({ publish_date: -1, _id: -1 })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .select({
        title: 1,
        content: 1,
        content_raw: 1,
        slug: 1,
        category: 1,
        keywords: 1,
        publish_date: 1,
        created_at: 1,
        updated_at: 1
      })
      .lean(),
    BlogModel.countDocuments(query)
  ]);

  return { posts, total };
});

export async function GET(request: Request) {
  let retryCount = 0;
  let lastError: Error | null = null;
  let connection: typeof mongoose | null = null;

  try {
    while (retryCount < MAX_RETRIES) {
      try {
        connection = await connect();
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Connection failed');
        retryCount++;
        if (retryCount < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
        throw lastError;
      }
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');

    const query: Record<string, any> = {
      publish_date: { $lte: new Date() },
      content: { $exists: true },
      title: { $exists: true },
      slug: { $exists: true }
    };
    
    if (category && category !== 'All') {
      query.category = {
        $regex: new RegExp('^' + category.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
      };
    }

    const { posts, total } = await getBlogPosts(query, page);
    
    if (!posts || !Array.isArray(posts)) {
      console.error('Invalid posts data:', posts);
      throw new Error('Failed to fetch blog posts');
    }

    // Transform dates to ISO strings for proper JSON serialization
    const transformedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      publish_date: post.publish_date ? post.publish_date.toISOString() : null,
      created_at: post.created_at ? post.created_at.toISOString() : null,
      updated_at: post.updated_at ? post.updated_at.toISOString() : null
    }));

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        total,
        pages: Math.ceil(total / ITEMS_PER_PAGE),
        current: page,
        limit: ITEMS_PER_PAGE
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Vary': 'Accept-Encoding, Cookie'
      }
    });

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}