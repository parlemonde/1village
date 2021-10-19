import type { MimiquesData, GameMimiqueActivity, GameMonnaieActivity, GameActivity } from '../../types/game.type';
import { GameType } from '../../types/game.type';

export const DEFAULT_MIMIQUE_DATA: MimiquesData = {
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

export const isMimique = (activity: GameActivity): activity is GameMimiqueActivity => {
  return activity.subType === GameType.MIMIQUE;
};
export const isMonnaie = (activity: GameActivity): activity is GameMonnaieActivity => {
  return activity.subType === null || activity.subType === GameType.MONNAIE;
};
