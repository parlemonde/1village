export type ActivityContentType = 'text' | 'video' | 'image' | 'h5p' | 'sound' | 'document';
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
  GAME: 4, // mimic 0, monnaie 1 expression 2
  CONTENU_LIBRE: 5,
  INDICE: 6,
  MASCOTTE: 8,
  REPORTAGE: 9,
  REACTION: 10,
  ANTHEM: 11,
  CLASS_ANTHEM: 12,
  STORY: 13,
  RE_INVENT_STORY: 14,
};

export const ActivityStatus = {
  PUBLISHED: 0,
  DRAFT: 1,
};

// (Erreur TS2749) Pour pouvoir typer les activityStatus sans passer par une enum il faut rajouter le type suivant :
export type ActivityStatus = typeof ActivityStatus[keyof typeof ActivityStatus];

export interface Activity<T extends AnyData = AnyData> {
  id: number;
  type: number;
  subType?: number | null;
  status: number;
  phase: number;

  createDate?: Date | string;
  updateDate?: Date | string;
  publishDate?: Date | string | null;
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
  villageId: number | undefined;

  // Answer other activity
  responseActivityId?: number | null;
  responseType?: number | null;
  isVisibleToParent?: boolean;

  classroomId?: number | null;
}

// For activity Reaction, click is not allowed in the images in the Card

export const LinkNotAllowedInPath = {
  REACTION: '/reagir-a-une-activite/',
};

export enum EPhase1Steps {
  MESSAGE_LANCEMENT_PHASE_1 = 'message-de-lancement-phase-1',
  RELANCE_PHASE_1 = 'relance-phase-1',
  ENIGME_PAYS_1 = 'enigme-pays-1',
}
export enum EPhase2Steps {
  ENIGME_PAYS_2 = 'enigme-pays-2',
  MESSAGE_LANCEMENT_PHASE_2 = 'message-de-lancement-phase-2',
  RELANCE_PHASE_2 = 'relance-phase-2',
  ACTIVITE_8_MARS = 'activité-8-mars',
  ACTIVITE_EMI = 'activite-EMI',
  MESSAGE_CLOTURE_PHASE_2 = 'message-de-cloture-phase-2',
}
export enum EPhase3Steps {
  MESSAGE_LANCEMENT_PHASE_3 = 'message-de-lancement-phase-3',
  RELANCE_PHASE_3 = 'relance-phase-3',
  PARAMETRAGE_DE_L_HYMNE = 'parametrage-de-lhymne',
  MIXAGE_DE_L_HYMNE = 'mixage-de-lhymne',
  MESSAGE_CLOTURE_PHASE_3 = 'message-de-clôture-phase-3',
}
