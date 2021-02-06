import type { ActivityData } from './activityData.type';

export enum ActivityType {
  PRESENTATION = 0,
  ENIGME = 1,
  DEFI = 2,
  QUESTION = 3,
  GAME = 4,
}

export interface Activity {
  id: number;
  type: ActivityType;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;

  // activity content
  content: ActivityData[] | null;

  // user relation
  userId: number;

  // village relation
  villageId: number;

  // Answer other activity
  responseActivityId: number | null;
  responseType: ActivityType | null;
}
