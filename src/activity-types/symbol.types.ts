import type { Activity } from 'types/activity.type';

export type SymbolData = Record<string, never>; // empty object {}

export type SymbolActivity = Activity<SymbolData>;
