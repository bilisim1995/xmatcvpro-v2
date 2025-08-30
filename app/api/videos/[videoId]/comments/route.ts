import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb/client';
import { ObjectId, Document } from 'mongodb';

// Define the interface for a comment
interface IComment {
  _id: ObjectId;
  userId: string; // This can be an ObjectId string for anonymous users
  username: string;
  content: string;
  createdAt: Date;
}

// Define the interface for a video document to include comments
interface IVideoDocument extends Document {
  comments: IComment[]; // comments is an array of IComment, now required
}

export async function POST(req: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('xmatchpro');
    const videosCollection = db.collection<IVideoDocument>('videos'); // Use the defined interface

    const { videoId } = params;
    const { userId, username, content } = await req.json();

    if (!videoId || !username || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newComment: IComment = { // Explicitly type newComment as IComment
      _id: new ObjectId(),
      userId: userId || new ObjectId().toHexString(), // Use provided userId or generate one for anonymous
      username,
      content,
      createdAt: new Date(),
    };


    const result = await videosCollection.updateOne(
      { _id: new ObjectId(videoId) },
      { $push: { comments: newComment as any } } // Cast newComment to any here
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Failed to post comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db('xmatchpro');
    const videosCollection = db.collection<IVideoDocument>('videos'); // Use the defined interface

    const { videoId } = params;

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const video = await videosCollection.findOne(
      { _id: new ObjectId(videoId) },
      { projection: { comments: 1 } }
    );

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video.comments || [], { status: 200 });
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}