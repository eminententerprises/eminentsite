export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  specialties: string[];
  areasCovered: string[];
  /** PLACEHOLDER response-time metric, mock only */
  responseTimeHours: number;
  listingsCount: number;
}
