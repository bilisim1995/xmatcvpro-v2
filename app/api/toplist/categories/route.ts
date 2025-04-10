import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { TopListCategoryModel } from '@/lib/mongodb/toplist';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connect();

    const categories = await TopListCategoryModel
      .find({})
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return NextResponse.json(categories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Failed to fetch categories' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}