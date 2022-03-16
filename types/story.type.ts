import type { Activity } from './activity.type';

export enum ImageType {
  OBJECT = 0,
  PLACE = 1,
  ODD = 2,
  // TALE = 3,
}

// Image is for the DB.
export interface Image {
  id: number;
  activityId: number;
  imageType: number;
  imageUrl: string;
  inspiredStoryId: number | null;
}

// Starting from here, the types are for Front.
export type StoriesData = {
  object: StoryElement;
  place: StoryElement;
  odd: StoryElement;
  isOriginal: boolean;
  // maybe we can create a function. TBD
};

// Generic type for story elements and tale element
export type GenericStoryElement = {
  imageId: number;
  imageUrl: string;
  // activityId: number | null; //foreign key to connect original and inspired stories
};

export type StoryElement = GenericStoryElement & {
  description: string;
};

export type TaleElement = GenericStoryElement & {
  tale: string;
};

export type StoryActivity = Activity<StoriesData>;
