import type { MimicsData, GameMimicActivity, GameMoneyActivity, GameActivity } from '../../types/game.type';
import { GameType } from '../../types/game.type';

export const DEFAULT_MIMIC_DATA: MimicsData = {
  game1: {
    gameId: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  game2: {
    gameId: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  game3: {
    gameId: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
};

export const isMimic = (activity: GameActivity): activity is GameMimicActivity => {
  return activity.subType === GameType.MIMIC;
};
export const isMoney = (activity: GameActivity): activity is GameMoneyActivity => {
  return activity.subType === GameType.MONEY;
};
