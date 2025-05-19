import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb/client'; // Adjusted the path

// This is the API route to fetch videos from MongoDB.

export async function GET() {
  try {
    const client = await clientPromise;
    // Use the database name from environment variable as found in lib/mongodb/db.ts
    // Ensure MONGODB_DB environment variable is set.
    if (!process.env.MONGODB_DB) {
      throw new Error('MONGODB_DB environment variable is not set.');
    }
    const db = client.db(process.env.MONGODB_DB);

    const videos = await db.collection('videos').find({}).toArray();

    // Ensure the fetched videos match the expected structure:
    // interface Video {
    //   _id: string; // MongoDB ObjectId will be converted to string by .toArray()
    //   title?: string;
    //   url?: string;
    //   cdn_url: string;
    //   thumbnail_url?: string;
    //   category?: string;
    //   description?: string;
    //   created_at?: Date; // MongoDB Date type
    //   updated_at?: Date; // MongoDB Date type
    // }

    return NextResponse.json({ videos: videos });

  } catch (error) {
    console.error('Error fetching videos from database:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}