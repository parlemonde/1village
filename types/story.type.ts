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
  imageUrl: string | null;
  inspiredStoryId: number | null;
}

export type ImageRandom = Image & {
  createDate: string;
  updateDate: string;
  deleteDate: string | null;
  userId: number;
  villageId: number;
};

export type ImagesRandomData = {
  object: ImageRandom;
  place: ImageRandom;
  odd: ImageRandom;
};

// Starting from here, the types are for Front.
export type StoriesData = {
  object: StoryElement;
  place: StoryElement;
  odd: StoryElement;
  tale: TaleElement;
  isOriginal: boolean;
  // maybe we can create a function. TBD
};

// Generic type for story elements and tale element
export type GenericStoryElement = {
  imageId: number | null;
  imageUrl: string | null;
  // activityId: number | null; //foreign key to connect original and inspired stories
};

// --- structure of each story ---
export type StoryElement = GenericStoryElement & {
  description: string | null;
};

// --- structure of each tale ---
export type TaleElement = {
  imageId: number | null;
  imageStory: string | null;
  tale: string | null;
};

export type StoryActivity = Activity<StoriesData>;
