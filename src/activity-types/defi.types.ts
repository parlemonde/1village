import type { GenericExtendedActivity } from './extendedActivity.types';

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
  languageCode: string;
  language: string;
  languageIndex: number;
  objectIndex: number;
  defiIndex: number;
  explanationContentIndex: number;
  defi?: string;
};

export type CookingDefiActivity = GenericExtendedActivity<CookingDefiData>;
export type EcoDefiActivity = GenericExtendedActivity<EcoDefiData>;
export type LanguageDefiActivity = GenericExtendedActivity<LanguageDefiData>;

export type DefiActivity = CookingDefiActivity | EcoDefiActivity | LanguageDefiActivity;
