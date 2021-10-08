import { MimiquesData, GameMimiqueActivity, GameMonnaieActivity, GameActivity, GameType } from '../../types/game.type';

export const DEFAULT_MIMIQUE_DATA: MimiquesData = {
  mimique1: {
    mimiqueId: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  mimique2: {
    mimiqueId: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  mimique3: {
    mimiqueId: null,
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
