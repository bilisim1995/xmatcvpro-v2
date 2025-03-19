'use server';

import { ModelDetails } from './types';

export function validateModelData(data: any): data is ModelDetails {
  if (!data || typeof data !== 'object') return false;
  
  // Required fields
  if (!data.id || typeof data.id !== 'string') return false;
  if (!data.name || typeof data.name !== 'string') return false;
  if (!data.profile_image || typeof data.profile_image !== 'string') return false;

  return true;
}

export function sanitizeModelData(data: Record<string, any>): ModelDetails {
  return {
    id: data.id,
    name: data.name,
    profile_image: data.profile_image,
    images: Array.isArray(data.images) ? data.images : [data.profile_image],
    videos: Array.isArray(data.videos) ? data.videos : [], // eğer eklediysen
    description: data.description,
    link: data.link,
    age: data.age ? Number(data.age) : undefined,
    height: data.height ? { value: Number(data.height) } : undefined,
    weight: data.weight ? { value: Number(data.weight) } : undefined,
    cup_size: data.cup_size,
    measurements: data.measurements,
    nationality: data.nationality ? [data.nationality] : [],
    ethnicity: data.ethnicity,
    hair_color: data.hair_color || data.hair,
    eye_color: data.eye_color || data.eyes,
    tattoos: data.tattoos ? { has_tattoos: true } : { has_tattoos: false },
    piercings: data.piercings ? { has_piercings: true } : { has_piercings: false },
    social_media: {
      instagram: data.social_media?.instagram,
      twitter: data.social_media?.twitter,
      onlyfans: data.social_media?.onlyfans,
    },
    stats: {
      views: Number(data.stats?.views) || 0,
      likes: Number(data.stats?.likes) || 0,
      video_views: Number(data.stats?.video_views) || 0,
      rating: Number(data.stats?.rating) || 0
    }
  };
}
