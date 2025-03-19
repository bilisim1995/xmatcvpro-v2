export interface SearchResponse {
  id: string;
  name: string;
  image: string;
  confidence: number;
  link1?: string;
  age?: number;
  height?: number;
  weight?: number;
  cup_size?: string;
  nationality?: string;
  ethnicity?: string;
  hair?: string;
  eyes?: string;
  tats?: string;
  piercings?: string;
}

export interface SearchError {
  message: string;
  code?: string;
}