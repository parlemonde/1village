import type { GenericExtendedActivity } from './extendedActivity.types';

export type FreeContentData = {
  title: string;
  resume: string;
  content?: string;
  indiceContentIndex: number;
  isPinned: boolean;
};

export type FreeContentActivity = GenericExtendedActivity<FreeContentData>;
