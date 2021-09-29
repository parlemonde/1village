import type { GenericExtendedActivity } from './extendedActivity.types';

export type FreeContentData = {
  content?: string;
  indiceContentIndex: number;
};

export type FreeContentActivity = GenericExtendedActivity<FreeContentData>;
