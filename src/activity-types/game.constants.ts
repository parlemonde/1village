import type {
  MimicsData,
  ExpressionsData,
  GameMimicActivity,
  GameExpressionActivity,
  GameMoneyActivity,
  GameActivity,
  MimicData,
  ExpressionData,
} from '../../types/game.type';
import { GameType } from '../../types/game.type';

export const DEFAULT_MIMIC_DATA: MimicsData = {
  game1: {
    gameId: null,
    createDate: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  game2: {
    gameId: null,
    createDate: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
  game3: {
    gameId: null,
    createDate: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    video: null,
  },
};

export const DEFAULT_EXPRESSION_DATA: ExpressionsData = {
  game1: {
    gameId: null,
    createDate: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    language: null,
    video: null,
  },
  game2: {
    gameId: null,
    createDate: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    language: null,
    video: null,
  },
  game3: {
    gameId: null,
    createDate: null,
    origine: null,
    signification: null,
    fakeSignification1: null,
    fakeSignification2: null,
    language: null,
    video: null,
  },
};

export const isMimicValid = (data: MimicData): boolean => {
  return (
    data.signification != null &&
    data.signification.length > 0 &&
    data.fakeSignification1 != null &&
    data.fakeSignification1.length > 0 &&
    data.fakeSignification2 != null &&
    data.fakeSignification2.length > 0 &&
    data.video != null &&
    data.video.length > 0
  );
};

export const isExpressionValid = (data: ExpressionData): boolean => {
  return (
    data.signification != null &&
    data.signification.length > 0 &&
    data.fakeSignification1 != null &&
    data.fakeSignification1.length > 0 &&
    data.fakeSignification2 != null &&
    data.fakeSignification2.length > 0 &&
    data.language != null &&
    data.language.length > 0 &&
    data.video != null &&
    data.video.length > 0
  );
};

export const isMimic = (activity: GameActivity): activity is GameMimicActivity => {
  return activity.subType === GameType.MIMIC;
};
export const isMoney = (activity: GameActivity): activity is GameMoneyActivity => {
  return activity.subType === GameType.MONEY;
};
export const isExpression = (activity: GameActivity): activity is GameExpressionActivity => {
  return activity.subType === GameType.EXPRESSION;
};
