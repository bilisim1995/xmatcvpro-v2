import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb/client';

export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  const { videoId } = params;

  if (!videoId || !ObjectId.isValid(videoId)) {
    return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('xmatchpro');
    const videosCollection = db.collection('videos');

    const result = await videosCollection.findOneAndUpdate(
      { _id: new ObjectId(videoId) },
      { $inc: { views: 1 } },
      { returnDocument: 'after' } // Return the updated document
    );

    // Check if the result or its value is null
    if (!result || !result.value) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Now it's safe to access result.value
    return NextResponse.json({ success: true, views: result.value.views });
  } catch (error)
 {
    console.error('Failed to increment video view count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
