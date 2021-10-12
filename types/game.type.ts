import type { GenericExtendedActivity } from '../src/activity-types/extendedActivity.types';

export enum GameType {
  MIMIQUE = 0,
  MONNAIE = 1,
}

export interface Game {
  id: number;
  //type: GameType;
  type: number | null;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number;
  activityId: number;
  content: string;
}

export type GamesData = {
  game1: GameData;
  game2: GameData;
  game3: GameData;
};

export type GameData = {
  gameId: number | null;
  type: GameType;
  value: string;
};

export type MimiquesData = {
  mimique1: MimiqueData;
  mimique2: MimiqueData;
  mimique3: MimiqueData;
};

export type MimiqueData = {
  // mimiqueId: number | null;
  gameId: number | null;
  origine: string | null;
  signification: string | null;
  fakeSignification1: string | null;
  fakeSignification2: string | null;
  video: string | null;
};
//TODO: a dégager
export type MonnaieData = {
  theme: number;
};

export type GameMimiqueActivity = GenericExtendedActivity<MimiquesData>;

export type GameMonnaieActivity = GenericExtendedActivity<MonnaieData>;

export type GameActivity = GameMimiqueActivity | GameMonnaieActivity;
