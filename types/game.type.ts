import type { GenericExtendedActivity } from '../src/activity-types/extendedActivity.types';

export enum GameType {
  MIMIQUE = 0,
  MONNAIE = 1,
}

export interface Game {
  id: number;
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
  gameId?: number | null;
  type: GameType;
  value: string;
};

export type MimiquesData = {
  game1: MimiqueData;
  game2: MimiqueData;
  game3: MimiqueData;
};

export type MimiqueData = {
  gameId: number | null;
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
//export type GameMimiqueActivity = GenericExtendedActivity<GamesData>;

export type GameMonnaieActivity = GenericExtendedActivity<MonnaieData>;

export type GameActivity = GameMimiqueActivity | GameMonnaieActivity;
