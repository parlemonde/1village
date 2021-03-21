import { GenericExtendedActivity } from './extendedActivity.types';

export type EnigmeData = {
  theme: number;
  indiceContentIndex: number;
};

export type EnigmeActivity = GenericExtendedActivity<EnigmeData>;
