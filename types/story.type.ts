import type { Activity } from './activity.type';

export enum ImageType {
  ODD = 0,
  OBJECT = 1,
  PLACE = 2,
}

// Image is for the DB.
export interface Image {
  id: number;
  activityId: number;
  imageType: number;
  imageUrl: string | null;
  inspiredStoryId: number | null;
}

export type ImagesRandomData = {
  odd: StoryElement[];
  object: StoryElement[];
  place: StoryElement[];
};

// Starting from here, the types are for Front.
export type StoriesData = {
  odd: StoryElement;
  object: StoryElement;
  place: StoryElement;
  tale: TaleElement;
  isOriginal: boolean;
};

// Generic type for story elements and tale element
export type GenericStoryElement = {
  imageId: number | null;
  imageUrl: string | null;
};

// --- structure of each story ---
export type StoryElement = GenericStoryElement & {
  description: string | null;
  inspiredStoryId?: number | null;
};

// --- structure of each tale ---
export type TaleElement = {
  imageId: number | null;
  imageStory: string | null;
  tale: string | null;
};

export type StoryActivity = Activity<StoriesData>;
