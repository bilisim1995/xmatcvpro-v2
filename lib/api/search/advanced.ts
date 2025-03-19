'use client';

import { ModelFilters, SearchResult } from '../types';
import { AdultModel } from '@/lib/mongodb/db';

export async function searchModels(filters: ModelFilters): Promise<SearchResult[]> {
  try {
    const query: Record<string, any> = {};

    // Build MongoDB query from filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      switch (key) {
        case 'hair_color':
          query.hair_color = { $regex: new RegExp(value as string, 'i') };
          break;
        case 'eye_color':
          query.eye_color = { $regex: new RegExp(value as string, 'i') };
          break;
        case 'cup_size':
          query.cup_size = { $regex: new RegExp(`^${value}$`, 'i') };
          break;
        case 'age':
          const age = Number(value);
          if (!isNaN(age)) query.age = age;
          break;
        case 'height':
          const height = Number(value);
          if (!isNaN(height)) query['height.value'] = height;
          break;
        case 'weight':
          const weight = Number(value);
          if (!isNaN(weight)) query['weight.value'] = weight;
          break;
        case 'nationality':
          query.nationality = { $regex: new RegExp(value as string, 'i') };
          break;
        case 'ethnicity':
          query.ethnicity = { $regex: new RegExp(value as string, 'i') };
          break;
        case 'tattoos':
          query['tattoos.has_tattoos'] = value === 'yes';
          break;
        case 'piercings':
          query['piercings.has_piercings'] = value === 'yes';
          break;
      }
    });

    const models = await AdultModel.find(query)
      .select('name profile_image link age height weight cup_size nationality ethnicity hair_color eye_color tattoos piercings')
      .limit(16)
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
    console.error('Advanced search error:', error);
    throw error instanceof Error ? error : new Error('Failed to search models');
  }
}