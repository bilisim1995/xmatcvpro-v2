import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { TopListSiteModel } from '@/lib/mongodb/toplist';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');

    await connect();

    // If no category ID is provided, fetch all sites
    const query = categoryId ? { category_id: categoryId } : {};
    
    const sites = await TopListSiteModel
      .find(query)
      .sort({ order: 1, created_at: -1 })
      .lean()
      .exec();

    return NextResponse.json(sites);

  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { message: 'Failed to fetch sites' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}