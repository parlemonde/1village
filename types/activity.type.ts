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
  isVisibleToParent?: boolean;
}

// For activity Reaction, click is not allowed in the images in the Card

export const LinkNotAllowedInPath = {
  REACTION: '/reagir-a-une-activite/',
};

export enum ActivityPhaseStep {
  MESSAGE_LANCEMENT_PHASE_1 = 'Message de lancement phase 1',
  RELANCE_PHASE_1 = 'Relance phase 1',
  ENIGME_PAYS_1 = 'Enigme pays 1',
  ENIGME_PAYS_2 = 'Enigme pays 2',
  MESSAGE_LANCEMENT_PHASE_2 = 'Message de lancement phase 2',
  RELANCE_PHASE_2 = 'Relance phase 2',
  ACTIVITE_8_MARS = 'Activité 8 mars',
  ACTIVITE_EMI = 'activité EMI',
  MESSAGE_CLOTURE_PHASE_2 = 'Message de clôture phase 2',
  MESSAGE_LANCEMENT_PHASE_3 = 'Message de lancement phase 3',
  RELANCE_PHASE_3 = 'Relance phase 3',
  PARAMETRAGE_DE_L_HYMNE = "Paramétrage de l'hymne",
  MIXAGE_DE_L_HYMNE = "Mixage de l'hymne",
  MESSAGE_CLOTURE_PHASE_3 = 'Message de clôture phase 3',
}
