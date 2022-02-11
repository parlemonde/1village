import type { Activity } from 'types/activity.type';

export type SymbolData = {
  symbol?: string;
};

export type SymbolActivity = Activity<SymbolData>;
