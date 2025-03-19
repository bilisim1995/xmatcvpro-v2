'use client';

import { SearchResult } from '../types';
import { AdultModel } from '@/lib/mongodb/db';
import { initializeFaceApi } from '@/lib/face-detection/initialize';

export async function searchByImage(imageUrl: string): Promise<SearchResult[]> {
  try {
 
    
    // Initialize face detection models first
    await initializeFaceApi();
    
  
    // Get models from database
    const models = await AdultModel.find()
      .select('name profile_image link age height weight cup_size nationality ethnicity hair_color eye_color tattoos piercings')
      .lean()
      .exec();

    return models.map(model => ({
      id: model._id?.toString() || '',
      name: model.name,
      image: model.profile_image,
      link1: model.link,
      age: model.age,
      height: model.height?.value,
      weight: model.weight?.value,
      cup_size: model.cup_size,
      nationality: Array.isArray(model.nationality) ? model.nationality[0] : model.nationality,
      ethnicity: model.ethnicity,
      hair: model.hair_color,
      eyes: model.eye_color,
      tats: model.tattoos?.has_tattoos ? 'yes' : 'no',
      piercings: model.piercings?.has_piercings ? 'yes' : 'no',
      slug: model.name?.toLowerCase().replace(/\s+/g, '-') || ''
    }));
  } catch (error) {
    console.error('Search error:', error);
    throw error instanceof Error ? error : new Error('Failed to process image. Please try again.');
  }
}