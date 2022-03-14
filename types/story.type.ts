import type { Activity } from './activity.type';

export enum ImageType {
  OBJECT = 0,
  PLACE = 1,
  ODD = 2,
  TALE = 3,
}

// Image is for the DB.
export interface Image {
  id: number;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number;
  activityId: number;
  imageType: number;
  imageUrl: string;
}

// Starting from here, the types are for Front.
export type StoriesData = {
  object: StoryElement;
  place: StoryElement;
  odd: StoryElement;
  tale: TaleElement;
  isOriginal: boolean;
};

// Generic type for story elements and tale element
export type GenericStoryElement = {
  imageId: number;
  imageUrl: string;
  activityId: number; //foreign key to connect original and inspired stories
  imageType: number;
};
export type StoryElement = GenericStoryElement & {
  description: string;
};

export type TaleElement = GenericStoryElement & {
  tale: string;
};

export type StoryActivity = Activity<StoriesData>;
