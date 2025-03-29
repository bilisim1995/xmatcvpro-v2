import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { BlogModel } from '@/lib/mongodb/blog';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connect();

    const post = await BlogModel.findOne({ slug: params.slug }).lean();

    if (!post) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch blog post' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}