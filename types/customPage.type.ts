export type CustomPageContentType = 'text' | 'video' | 'image' | 'h5p' | 'sound' | 'document';

export interface CustomPageContent {
  id: number;
  type: CustomPageContentType;
  value: string;
}

export interface CustomPage {
  id: number;
  content: CustomPageContent[];
  pageType: 'maintenance' | 'home' | 'pelico';
  isActive?: boolean;
  visibility?: 'classe' | 'famille';
}
