import type { GenericExtendedActivity } from './extendedActivity.types';

export type SymbolData = {
  theme: number;
  indiceContentIndex: number;
};

export type SymbolActivity = GenericExtendedActivity<SymbolData>;