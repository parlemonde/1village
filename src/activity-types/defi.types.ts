import type { Activity } from 'types/activity.type';

export type CookingDefiData = {
  image?: string;
  name: string;
  history: string;
  explanation: string;
  defiIndex: number;
  defi?: string;
};

export type EcoDefiData = {
  type: number;
  defiIndex: number;
  defi?: string;
};

export type LanguageDefiData = {
  themeName: string;
  languageCode: string;
  language: string;
  languageIndex: number;
  objectIndex: number;
  defiIndex: number;
  explanationContentIndex: number;
  defi?: string;
};

export type FreeDefiData = {
  themeName: string;
  defiIndex: number;
  defi?: string;
};

export type CookingDefiActivity = Activity<CookingDefiData>;
export type EcoDefiActivity = Activity<EcoDefiData>;
export type LanguageDefiActivity = Activity<LanguageDefiData>;
export type FreeDefiActivity = Activity<FreeDefiData>;

export type DefiActivity = CookingDefiActivity | EcoDefiActivity | LanguageDefiActivity | FreeDefiActivity;
