export type ActivityContentType = 'text' | 'video' | 'image' | 'h5p' | 'sound';
export interface ActivityContent {
  id: number; // needed to sort content.
  type: ActivityContentType;
  value: string;
}

export type AnyData = Record<string, unknown>;

export const ActivityType = {
  PRESENTATION: 0,
  ENIGME: 1,
  DEFI: 2,
  QUESTION: 3,
  GAME: 4,
  CONTENU_LIBRE: 5,
  INDICE: 6,
  SYMBOL: 7,
};

export const ActivityStatus = {
  PUBLISHED: 0,
  DRAFT: 1,
};

export interface Activity<T extends AnyData = AnyData> {
  id: number;
  type: number;
  subType?: number | null;
  status: number;

  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;

  // activity data
  data: T & { draftUrl?: string };

  // activity content
  content: ActivityContent[];

  // user relation
  userId: number;
  commentCount?: number;
  isPinned?: boolean;

  // village relation
  villageId: number;

  // Answer other activity
  responseActivityId: number | null;
  responseType: number | null;
}
