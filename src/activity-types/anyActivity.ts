import type { AnthemActivity } from '../../types/anthem.type';
import type { GameActivity } from '../../types/game.type';
import type { DefiActivity } from './defi.types';
import type { EnigmeActivity } from './enigme.types';
import type { FreeContentActivity } from './freeContent.types';
import type { IndiceActivity } from './indice.types';
import type { MascotteActivity } from './mascotte.types';
import type { PresentationActivity } from './presentation.types';
import type { QuestionActivity } from './question.types';
import type { ReactionActivity } from './reaction.types';
import type { ReportageActivity } from './reportage.types';
import type { SymbolActivity } from './symbol.types';
import type { ClassAnthemActivity } from './verseRecord.types';
import { ActivityType } from 'types/activity.type';
import type { Activity } from 'types/activity.type';
import type { StoryActivity } from 'types/story.type';

export const isPresentation = (activity: Activity): activity is PresentationActivity => {
  return activity.type === ActivityType.PRESENTATION;
};
export const isQuestion = (activity: Activity): activity is QuestionActivity => {
  return activity.type === ActivityType.QUESTION;
};
export const isEnigme = (activity: Activity): activity is EnigmeActivity => {
  return activity.type === ActivityType.ENIGME;
};
export const isDefi = (activity: Activity): activity is DefiActivity => {
  return activity.type === ActivityType.DEFI;
};
export const isFreeContent = (activity: Activity): activity is FreeContentActivity => {
  return activity.type === ActivityType.CONTENU_LIBRE;
};
export const isIndice = (activity: Activity): activity is IndiceActivity => {
  return activity.type === ActivityType.INDICE;
};
export const isSymbol = (activity: Activity): activity is SymbolActivity => {
  return activity.type === ActivityType.SYMBOL;
};
export const isMascotte = (activity: Activity): activity is MascotteActivity => {
  return activity.type === ActivityType.MASCOTTE;
};
export const isGame = (activity: Activity): activity is GameActivity => {
  return activity.type === ActivityType.GAME;
};
export const isReportage = (activity: Activity): activity is ReportageActivity => {
  return activity.type === ActivityType.REPORTAGE;
};
export const isReaction = (activity: Activity): activity is ReactionActivity => {
  return activity.type === ActivityType.REACTION;
};
export const isStory = (activity: Activity): activity is StoryActivity => {
  return activity.type === ActivityType.STORY || activity.type === ActivityType.RE_INVENT_STORY;
};
export const isAnthem = (activity: Activity): activity is AnthemActivity => {
  return activity.type === ActivityType.ANTHEM;
};
export const isClassAnthem = (activity: Activity): activity is ClassAnthemActivity => {
  return activity.type === ActivityType.CLASS_ANTHEM;
};
