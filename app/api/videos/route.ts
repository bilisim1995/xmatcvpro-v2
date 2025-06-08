import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/client'; // Adjust path if necessary

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('xmatchpro'); // Your database name
    const videosCollection = db.collection('videos'); // Your videos collection name

    const { searchParams } = new URL(req.url);
    const channelName = searchParams.get('channel');

    let query = {};
    if (channelName) {
      // Assuming your video documents have a 'channel' field
      // Use a case-insensitive regex for broader matching if needed, or direct match.
      query = { channel: channelName }; 
      // Example for case-insensitive: query = { channel: new RegExp(`^${channelName}$`, 'i') };
    }

    // Add any default sorting if needed, e.g., by createdAt descending
    const videos = await videosCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    // The client-side mapApiVideoToVideo expects objects with $oid, $numberInt etc.
    // Ensure your API returns data in that raw format if mapApiVideoToVideo is used as is.
    // Or, adjust mapApiVideoToVideo to handle already-parsed data if your API does parsing.
    // For now, assuming API returns documents as they are in MongoDB.
    return NextResponse.json({ videos });

  } catch (error) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
