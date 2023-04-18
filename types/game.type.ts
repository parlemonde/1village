import type { Activity } from './activity.type';

export enum GameType {
  MIMIC = 0,
  MONEY = 1,
}

// export interface Game
export interface Game {
  id: number;
  type: number | null;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number;
  activityId: number;
  fakeSignification1: string;
  fakeSignification2: string;
  origine: string;
  signification: string;
  video: string;
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

// --- three different mimiques ---
export type MimicsData = {
  game1: MimicData;
  game2: MimicData;
  game3: MimicData;
};

// --- three different objects ---
export type MoneysData = {
  game1: MoneyData;
  game2: MoneyData;
  game3: MoneyData;
};

// --- structure of each mimique ---
export type MimicData = {
  gameId: number | null;
  origine?: string | null;
  signification: string | null;
  fakeSignification1: string | null;
  fakeSignification2: string | null;
  video: string | null;
};

// --- Money game three objects & money game structure ---
export type MoneyData = {
  gameId: number | null;
  name: string | null;
  price: string | null;
  description: string | null;
  image: string | null;
};

export type GameMimicActivity = Activity<MimicsData>;

export type GameMoneyActivity = Activity<MoneysData>;

export type GameActivity = GameMimicActivity | GameMoneyActivity;
