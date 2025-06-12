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

    if (channelName) {
      // If a channel is specified, fetch videos for that channel, sorted by newest first.
      // Using a regular expression for a case-insensitive match on the channel name.
      videos = await videosCollection.find({ channel: new RegExp(`^${channelName}$`, 'i') }).sort({ createdAt: -1 }).toArray();
    } else {
      // For the general feed, fetch a random sample of videos.
      const pipeline = [{ $sample: { size: 100 } }]; // Fetches 100 random videos
      videos = await videosCollection.aggregate(pipeline).toArray();
    }
    
    return NextResponse.json({ videos });

  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
