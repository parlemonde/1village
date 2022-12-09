export type ActivityContentType = 'text' | 'video' | 'image' | 'h5p' | 'sound';
export interface ActivityContent {
  id: number; // needed to sort content.
  type?: ActivityContentType | null;
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
  MASCOTTE: 8,
  REPORTAGE: 9,
  REACTION: 10,
  ANTHEM: 11,
  VERSE_RECORD: 12,
  STORY: 13,
  RE_INVENT_STORY: 14,
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
  phase: number;

  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;

  // activity data
  data: T & { draftUrl?: string; presentation?: string };

  // activity content
  content: ActivityContent[];

  // user relation
  userId: number;
  commentCount?: number;
  isPinned?: boolean;
  displayAsUser?: boolean; // For admins who wants to publish as their own, not Pelico.

  // village relation
  villageId: number;

  // Answer other activity
  responseActivityId?: number | null;
  responseType?: number | null;
}

// For activity Reaction, click is not allowed in the images in the Card

export const LinkNotAllowedInPath = {
  REACTION: '/reagir-a-une-activite/',
};
