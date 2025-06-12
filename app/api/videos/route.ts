import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/client';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('xmatchpro');
    const videosCollection = db.collection('videos');

    const { searchParams } = new URL(req.url);
    const channelName = searchParams.get('channel');

    let videos;
    const size = 100; // Number of videos to fetch for the random feed

    if (channelName) {
      // If a channel is specified, fetch all videos for that channel, sorted by newest first.
      videos = await videosCollection
        .find({ channel: new RegExp(`^${channelName}$`, 'i') })
        .sort({ createdAt: -1 })
        .toArray();
    } else {
      // For the general feed, fetch a random sample of videos.
      const pipeline = [{ $sample: { size } }];
      videos = await videosCollection.aggregate(pipeline).toArray();
    }
    
    return NextResponse.json({ videos });

  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
