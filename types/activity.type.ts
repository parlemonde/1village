import type { ActivityData } from './activityData.type';

export enum ActivityType {
  PRESENTATION = 0,
  ENIGME = 1,
  DEFI = 2,
  QUESTION = 3,
  GAME = 4,
  CONTENU_LIBRE = 5,
  INDICE = 6,
  SYMBOL = 7,
}

export enum ActivityStatus {
  PUBLISHED = 0,
  DRAFT = 1,
}

export interface Activity {
  id: number;
  type: ActivityType;
  subType?: number | null;
  status: ActivityStatus;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  commentCount?: number;

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
