import GameIcon from 'src/svg/navigation/game-icon.svg';
import IndiceIcon from 'src/svg/navigation/indice-culturel.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import QuestionIcon from 'src/svg/navigation/question-icon.svg';
import SymbolIcon from 'src/svg/navigation/symbol-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { ActivityType } from 'types/activity.type';

export const titles = {
  [ActivityType.PRESENTATION]: 'créé une présentation',
  [ActivityType.DEFI]: 'créé un défi',
  [ActivityType.GAME]: 'lancé un jeu',
  [ActivityType.ENIGME]: 'créé une énigme',
  [ActivityType.QUESTION]: 'posé une question',
  [ActivityType.CONTENU_LIBRE]: 'envoyé un message à ses Pélicopains',
  [ActivityType.INDICE]: 'créé un indice culturel',
  [ActivityType.SYMBOL]: 'créé un symbole',
};

export const icons = {
  [ActivityType.PRESENTATION]: UserIcon,
  [ActivityType.DEFI]: TargetIcon,
  [ActivityType.GAME]: GameIcon,
  [ActivityType.ENIGME]: KeyIcon,
  [ActivityType.QUESTION]: QuestionIcon,
  [ActivityType.CONTENU_LIBRE]: '',
  [ActivityType.INDICE]: IndiceIcon,
  [ActivityType.SYMBOL]: SymbolIcon,
};

export const REACTIONS = {
  [ActivityType.PRESENTATION]: 'une présentation',
  [ActivityType.DEFI]: 'un défi',
  [ActivityType.GAME]: 'un jeu',
  [ActivityType.ENIGME]: 'une énigme',
  [ActivityType.QUESTION]: 'une question',
  [ActivityType.CONTENU_LIBRE]: 'un message',
  [ActivityType.INDICE]: 'un indice culturel',
  [ActivityType.SYMBOL]: 'un symbole',
};
