import { GenericExtendedActivity } from './extendedActivity.types';

export type CookingDefiData = {
  image?: string;
  name: string;
  history: string;
  explanation: string;
  defiIndex: number;
  defi?: string;
};

export type CookingDefiActivity = GenericExtendedActivity<CookingDefiData>;

export type DefiActivity = CookingDefiActivity;
