export type PelicoPresentationContentType = 'text' | 'video' | 'image' | 'h5p' | 'sound' | 'document';

export interface PelicoPresentationContent {
  id: number;
  type: PelicoPresentationContentType;
  value: string;
}

export interface PelicoPresentation {
  id: number;
  content: PelicoPresentationContent[];
}
