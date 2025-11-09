export interface ModelFilters {
  age?: number | string;
  height?: number | string;
  weight?: number | string;
  measurements?: string;
  country?: string;
  cup_size?: string;
  nationality?: string;
  ethnicity?: string;
  hair_color?: string;
  eye_color?: string;
  tattoos?: string;
  piercings?: string;
  body_type?: string;
  random?: boolean;
}

export interface ModelDetails {
  id: string;
  name: string;
  profile_image: string;
  images?: string[];
  videos: string[]; 
  description?: string;
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
    www?: string;
    instagram?: string;
    twitter?: string;
    onlyfans?: string;
    onlyfansfree?: string;
    imdb?: string;
    x?: string;
  };
  stats?: {
    views: number;
    likes: number;
    video_views: number;
    rating: number;
  };
}

export interface SearchResult {
  id: string;
  name: string;
  image: string;
  slug: string;
  description?: string; 
  confidence?: number;
  link1?: string;
  age?: number;
  height?: number;
  weight?: number;
  cup_size?: string;
  measurements?: string;
  nationality?: string;
  ethnicity?: string;
  hair?: string;
  eyes?: string;
  tats?: string;
  piercings?: string;
  social_media?: {
    www?: string;
    instagram?: string;
    twitter?: string;
    onlyfans?: string;
    onlyfansfree?: string;
    imdb?: string;
    x?: string;
  };
  stats?: {
    views: number;
    likes: number;
    rating: number;
  };
}



export interface SearchError {
  message: string;
  code?: string;
}