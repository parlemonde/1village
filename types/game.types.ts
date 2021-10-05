import type { GenericExtendedActivity } from '../src/activity-types/extendedActivity.types';

export enum GameType {
  MIMIQUE = 0,
  MONNAIE = 1,
}

export type MimiquesData = {
  mimique1: MimiqueData;
  mimique2: MimiqueData;
  mimique3: MimiqueData;
};

export type MimiqueData = {
  mimiqueId: number | null;
  origine: string | null;
  signification: string | null;
  fakeSignification1: string | null;
  fakeSignification2: string | null;
  video: string | null;
};

export type MonnaieData = {
  theme: number;
};

export type GameMimiqueActivity = GenericExtendedActivity<MimiquesData>;

export type GameMonnaieActivity = GenericExtendedActivity<MonnaieData>;

export type GameActivity = GameMimiqueActivity | GameMonnaieActivity;
