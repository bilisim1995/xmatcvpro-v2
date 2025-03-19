import { NextResponse } from 'next/server';
import { connect, disconnect } from '@/lib/mongodb/connection';
import { AdultModel } from '@/lib/mongodb/db';
import { Document, Types } from 'mongoose';

export const dynamic = 'force-dynamic';

interface ModelDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  about?: string;
  profile_image: string;
  link?: string;
  age?: number;
  height?: { value: number };
  weight?: { value: number };
  cup_size?: string;
  measurements?: string;
  nationality?: string[];
  ethnicity?: string;
  hair_color?: string;
  eye_color?: string;
  tattoos?: { has_tattoos: boolean };
  piercings?: { has_piercings: boolean };
  social_media?: {
    instagram?: string;
    twitter?: string;
    onlyfans?: string;
  };
  stats?: {
    views: number;
    likes: number;
    rating: number;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connect();

    // Clean and normalize the slug
    const searchSlug = params.slug
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '')
      .replace(/\s+/g, '-');
    
    // Try to find by exact slug match first
    let model = await AdultModel.findOne<ModelDocument>({
      slug: searchSlug
    }).lean();

    // If not found by slug, try by name
    if (!model) {
      const searchName = searchSlug.replace(/-/g, ' ');
      model = await AdultModel.findOne<ModelDocument>({
        name: { $regex: new RegExp(`^${searchName}$`, 'i') }
      }).lean();
    }

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: model._id?.toString(),
      name: model.name,
      slug: model.slug || model.name.toLowerCase().replace(/\s+/g, '-'),
      description: model.about || '',
      image: model.profile_image,
      link1: model.link,
      age: model.age,
      height: model.height?.value || null,
      weight: model.weight?.value || null,
      cup_size: model.cup_size,
      measurements: model.measurements,
      nationality: Array.isArray(model.nationality) ? model.nationality[0] : model.nationality,
      ethnicity: model.ethnicity,
      hair: model.hair_color,
      eyes: model.eye_color,
      tats: model.tattoos?.has_tattoos === true ? 'yes' : 'no',
      piercings: model.piercings?.has_piercings === true ? 'yes' : 'no',
      social_media: {
        www: model.social_media?.www,
        instagram: model.social_media?.instagram, 
        twitter: model.social_media?.twitter,
        onlyfans: model.social_media?.onlyfans,
        onlyfansfree: model.social_media?.onlyfansfree,
        imdb: model.social_media?.imdb,
        x: model.social_media?.x
      },
      stats: {
        views: model.stats?.views ?? 0,
        likes: model.stats?.likes ?? 0,
        rating: Number((model.stats?.rating ?? 0).toFixed(1))
      }
    });

  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model details' },
      { status: 500 }
    );
  } finally {
    await disconnect();
  }
}