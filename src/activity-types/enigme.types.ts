import type { Activity } from 'types/activity.type';

export type EnigmeData = {
  theme: number;
  themeName?: string;
  indiceContentIndex: number;
  timer: number;
};

export type EnigmeActivity = Activity<EnigmeData>;
