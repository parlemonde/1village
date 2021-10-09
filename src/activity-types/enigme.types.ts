import type { GenericExtendedActivity } from './extendedActivity.types';

export type EnigmeData = {
  theme: number;
  themeName?: string;
  indiceContentIndex: number;
  timer: number;
};

export type EnigmeActivity = GenericExtendedActivity<EnigmeData>;
