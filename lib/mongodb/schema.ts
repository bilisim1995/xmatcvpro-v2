

// MongoDB şema tipleri
export interface ModelDocument {
  // Temel Bilgiler
  _id: string;
  name: string;
  slug: string;
  profile_image: string;
  link: string;

  // Kişisel Bilgiler
  age: number;
  birth_date: Date;
  birthplace: {
    city: string;
    region: string;
    country: string;
  };
  nationality: string[];
  ethnicity: string;
  sexuality: string;

  // Fiziksel Özellikler
  hair_color: string;
  eye_color: string;
  height: {
    value: number;
    unit: 'cm' | 'in'
  };
  weight: {
    value: number;
    unit: 'kg' | 'lbs'
  };
  body_type: string;
  measurements: {
    bust: number;
    waist: number;
    hips: number;
  };
  cup_size: string;
  boobs: 'natural' | 'enhanced';
  pubic_hair: string;
  
  // Diğer Özellikler
  tattoos: {
    has_tattoos: boolean;
    locations: string[];
  };
  piercings: {
    has_piercings: boolean;
    locations: string[];
  };

  // Sosyal Medya
  social_media: {
    instagram?: string;
    twitter?: string;
    imdb?: string;
  };

  // Açıklama
  about: string;

  // Face-API.js Verileri
  face_data: {
    detection_score: number;
    box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    landmarks: {
      positions: Array<{
        x: number;
        y: number;
      }>;
    };
    descriptor: number[];  // 128 boyutlu yüz özellik vektörü
    confidence: number;    // Benzerlik skoru için
  };

  // Meta Veriler
  created_at: Date;
  updated_at: Date;
  face_updated_at: Date;  // Yüz verilerinin son güncellenme tarihi
}

// Yüz özellik vektörü koleksiyonu için ayrı tip
export interface FaceDescriptorDocument {
  _id: string;
  model_id: string;
  descriptor: number[];
  detection_score: number;
  landmarks: Array<{x: number, y: number}>;
  confidence: number;
  created_at: Date;
  updated_at: Date;
}

// Örnek veri dönüşüm fonksiyonu
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformModelData(data: Record<string, any>): Partial<ModelDocument> {
  return {
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
    profile_image: data.profile_image,
    link: data.link,
    
    age: parseInt(data.age),
    birth_date: new Date(data.born),
    birthplace: {
      city: data.birthplace?.split(',')[0]?.trim(),
      region: data.birthplace?.split(',')[1]?.trim(),
      country: data.birthplace?.split(',')[2]?.trim()
    },
    nationality: data.nationality?.split(',').map((n: string) => n.trim()),
    ethnicity: data.ethnicity,
    sexuality: data.sexuality,

    hair_color: data.hair_color,
    eye_color: data.eye_color,
    height: {
      value: parseInt(data.height?.match(/\d+/)?.[0] || '0'),
      unit: data.height?.includes('cm') ? 'cm' : 'in'
    },
    weight: {
      value: parseInt(data.weight?.match(/\d+/)?.[0] || '0'),
      unit: data.weight?.includes('kg') ? 'kg' : 'lbs'
    },
    body_type: data.body_type,
    measurements: {
      bust: parseInt(data.measurements?.split('-')[0] || '0'),
      waist: parseInt(data.measurements?.split('-')[1] || '0'),
      hips: parseInt(data.measurements?.split('-')[2] || '0')
    },
    cup_size: data.cup_size || data.bra_size,
    boobs: data.boobs?.toLowerCase().includes('natural') ? 'natural' : 'enhanced',
    pubic_hair: data.pubic_hair,

    tattoos: {
      has_tattoos: !!data.tattoos,
      locations: data.tattoos?.split(';').map((t: string) => t.trim()) || []
    },
    piercings: {
      has_piercings: !!data.piercings,
      locations: data.piercings?.split(';').map((p: string) => p.trim()) || []
    },

    social_media: {
      instagram: data.social_media?.instagram,
      twitter: data.social_media?.x || data.social_media?.twitter,
      imdb: data.social_media?.imdb
    },

    about: data.about,
    
    created_at: new Date(),
    updated_at: new Date()
  };
}