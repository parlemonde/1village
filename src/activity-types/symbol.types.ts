import type { Activity } from 'types/activity.type';

export type SymbolData = {
  theme: number;
  indiceContentIndex: number;
};

export type SymbolActivity = Activity<SymbolData>;
