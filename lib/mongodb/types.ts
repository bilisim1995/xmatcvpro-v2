export interface ModelSearchResult {
  _id: string;
  name: string;
  image: string;
  link1?: string;
  confidence: number;
  age?: number;
  height?: number;
  weight?: number;
  cup_size?: string;
  nationality?: string;
  ethnicity?: string;
  hair?: string;
  eyes?: string;
  tats?: 'yes' | 'no';
  piercings?: 'yes' | 'no';
}