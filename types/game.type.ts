import type { Activity } from './activity.type';

export enum GameType {
  MIMIC = 0,
  MONEY = 1,
  EXPRESSION = 2,
}

export enum InputTypeEnum {
  INPUT = 0,
  RADIO = 1,
  SELECT = 2,
  IMAGE = 3,
  VIDEO = 4,
}

export type hiddenType = {
  id: number;
  value: string;
};

export type inputType = {
  id: number;
  type: InputTypeEnum;
  values?: string[];
  label?: string;
  response?: boolean;
  isDisplayedInRecap?: boolean;
  placeHolder?: string;
  methodType?: methodType;
  selectedValue?: string;
  hidden?: hiddenType;
  required?: boolean;
  isIndice?: boolean;
};

export type StepsTypes = {
  title?: string;
  description?: string;
  inputs?: inputType[];
};

export type GameFieldConfigType = {
  [type in GameType]: {
    steps: Array<StepsTypes[]>;
  };
};

export enum methodType {
  LANGUE = 'language',
  CURRENCY = 'currency',
}

// export interface Game
export interface Game {
  id: number;
  type: number | null;
  createDate?: Date | string;
  updateDate?: Date | string;
  deleteDate?: Date | string;
  userId: number;
  villageId: number | undefined;
  activityId: number;
  fakeSignification1: string;
  fakeSignification2: string;
  origine?: string;
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
  origine?: string;
  signification: string;
  fakeSignification1: string;
  fakeSignification2: string;
  video: string;
};

// --- three different mimiques ---
export type MimicsData = {
  game1: MimicData;
  game2: MimicData;
  game3: MimicData;
  labelPresentation?: string;
};

// --- three different objects ---
export type MoneysData = {
  game1: MoneyData;
  game2: MoneyData;
  game3: MoneyData;
  labelPresentation?: string;
};

// --- three differents expressions ---
export type ExpressionsData = {
  langage: string | null;
  game1: ExpressionData;
  game2: ExpressionData;
  game3: ExpressionData;
  labelPresentation?: string;
};

// --- structure of each mimique ---
export type MimicData = {
  gameId: number | null;
  createDate: string | Date | null;
  origine?: string | null;
  signification: string | null;
  fakeSignification1: string | null;
  fakeSignification2: string | null;
  video: string | null;
};

// --- structure of each expression game ---
export type ExpressionData = {
  gameId: number | null;
  createDate: string | Date | null;
  origine?: string | null;
  signification: string | null;
  fakeSignification1: string | null;
  fakeSignification2: string | null;
  video: string | null;
};
export type MoneyData = {
  gameId: number | null;
  createDate: string | Date | null;
  origine?: string | null;
  signification: string | null;
  fakeSignification1: string | null;
  fakeSignification2: string | null;
  video: string | null;
};

// --- structure to send to the server ---
// --- On utilise ce type et pas ce au dessus ---
export type GameDataStep = {
  game: StepsTypes[];
  language?: string;
  monney?: string;
  labelPresentation: string;
  radio?: string;
};

export type GameDataMonneyOrExpression = {
  userId: number;
  villageId: number;
  classroomId: number;
  type: number;
  subType: number;
  game1: GameDataStep;
  game2: GameDataStep;
  game3: GameDataStep;
  selectedPhase: number;
};
export type DataForPlayed = {
  game: StepsTypes;
  labelPresentation: string;
  language?: string;
  monnaie?: string;
  radio?: string;
};

export type GameMimicActivity = Activity<MimicsData>;

export type GameMoneyActivity = Activity<MoneysData>;

export type GameExpressionActivity = Activity<ExpressionsData>;

export type GameActivity = GameMimicActivity | GameMoneyActivity | GameExpressionActivity;
