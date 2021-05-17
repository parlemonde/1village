import { MimiquesData, GameMimiqueActivity, GameMonnaieActivity, GameActivity } from './game.types';

export const DEFAULT_MIMIQUE_DATA: MimiquesData = {
  mimique1: {
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  mimique2: {
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  mimique3: {
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
};

export const GAME = {
  MIMIQUE: 0,
  MONNAIE: 1,
};

export const isMimique = (activity: GameActivity): activity is GameMimiqueActivity => {
  return activity.subType === GAME.MIMIQUE;
};
export const isMonnaie = (activity: GameActivity): activity is GameMonnaieActivity => {
  return activity.subType === null || activity.subType === GAME.MONNAIE;
};
