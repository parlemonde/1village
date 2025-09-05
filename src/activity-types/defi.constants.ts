import type {
  CookingDefiActivity,
  CookingDefiData,
  DefiActivity,
  EcoDefiActivity,
  EcoDefiData,
  FreeDefiActivity,
  FreeDefiData,
  LanguageDefiActivity,
  LanguageDefiData,
} from './defi.types';
import { capitalize, replaceTokens } from 'src/utils';

export const COOKING_DEFIS = [
  {
    title: 'Réalisez notre recette à votre tour',
    description: 'Les pélicopains devront créer une présentation sous forme de texte, son, image ou une vidéo.',
  },
  {
    title: 'Présentez-nous une de vos recettes traditionnelles',
    description: 'Les pélicopains devront créer une présentation sous forme de texte, son, image ou une vidéo.',
  },
];
export const ECO_ACTIONS = [
  'Ramassage des déchets dans notre région',
  'Recyclage d’un objet du quotidien',
  'Mise en place d’écogestes dans la classe',
  'Actions auprès d’une association locale',
  'Action libre',
];
export const ECO_DEFIS = [
  {
    title: 'Réaliser cette action pour la planète à votre tour',
    description: 'Les pelicopains devront refaire votre action chez eux.',
  },
  {
    title: 'Imaginer et réaliser une nouvelle action pour la planète',
    description: 'Les pelicopains devront réaliser une autre action.',
  },
];
export const LANGUAGE_SCHOOL = [
  'maternelle chez tous les enfants',
  'maternelle chez certains enfants',
  'qu’on utilise pour faire cours',
  'qu’on apprend comme langue étrangère',
];
export const LANGUAGE_THEMES = [
  {
    title: 'Un mot',
    title2: 'le mot précieux',
    desc1: "Choisissez un mot qui a quelque chose d'original (prononciation,origine...) dans la langue {{language}}.",
    desc2: 'Ecrivez votre mot puis expliquez pourquoi vous avez choisi celui-ci, ce qu’il signifie et dans quelle situation vous l’utilisez.',
  },
  {
    title: 'Une expression',
    title2: "l'expression",
    desc1: 'Choisissez une expression surprenante dans la langue {{language}}.',
    desc2: 'Ecrivez votre expression puis expliquez pourquoi avoir choisi celle-ci, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une poésie',
    title2: 'la poésie',
    desc1: 'Choisissez une poésie écrite dans la langue {{language}}.',
    desc2: 'Ecrivez votre poésie puis expliquez pourquoi avoir choisi celle-ci, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une chanson',
    title2: 'la chanson',
    desc1: 'Choisissez une chanson écrite dans la langue {{language}}.',
    desc2: 'Ecrivez votre chanson puis expliquez pourquoi avoir choisi celle-ci, ce qu’elle signifie et quand vous l’utilisez.',
  },
];
export const LANGUAGE_DEFIS = [
  {
    title: 'Trouvez {{theme}} similaire dans une autre langue',
    description: 'Les pélicopains devront envoyer un texte, un son ou une vidéo.',
  },
  {
    title: 'Répétez à l’oral {{theme}} en {{language}}',
    description: 'Les pélicopains devront envoyer un son ou une vidéo.',
  },
  {
    title: 'Écrivez {{theme}} en {{language}}',
    description: 'Les pélicopains devront envoyer un texte, une image ou une vidéo.',
  },
];

export const FREE_DEFIS = [
  {
    title: 'Réalisez notre action à votre tour',
    description: 'Les pélicopains devront réaliser la même action que vous.',
  },
  {
    title: 'Réalisez une autre action sur le même thème',
    description: 'Les pélicopains devront réaliser une action sur le thème {{theme}}.',
  },
];
export const DEFI = {
  COOKING: 0,
  ECO: 1,
  LANGUAGE: 2,
  FREE: 3,
};

export enum DefiTypeEnum {
  COOKING = 'COOKING',
  ECOLOGICAL = 'ECOLOGICAL',
  LINGUISTIC = 'LINGUISTIC',
  OTHER = 'OTHER',
}

const defiTypeMap: Record<number, DefiTypeEnum> = {
  0: DefiTypeEnum.COOKING,
  1: DefiTypeEnum.ECOLOGICAL,
  2: DefiTypeEnum.LINGUISTIC,
  3: DefiTypeEnum.OTHER,
};

//TODO : factoriser en mode clean code le getDefi
//https://stackoverflow.com/questions/8900652/what-does-do-in-javascript
export const getDefi = (subtype: number, data: CookingDefiData | EcoDefiData | LanguageDefiData | FreeDefiData): string => {
  if (subtype === DEFI.ECO) {
    return data.defiIndex === -1 && data.defi ? data.defi : ECO_DEFIS[(data.defiIndex ?? 0) % ECO_DEFIS.length].title;
  }
  if (subtype === DEFI.LANGUAGE && 'language' in data && 'themeIndex' in data) {
    const defi = data.defiIndex !== null ? LANGUAGE_DEFIS[data.defiIndex].title : data.defi ? data.defi : '';
    return replaceTokens(defi, {
      theme: data.themeIndex !== null ? LANGUAGE_THEMES[data.themeIndex].title2.toLowerCase() : data.themeName,
      language: data.languageCode.length > 0 ? data.language : "(langue non choisie à l'étape 1)",
    });
  }
  if (subtype === DEFI.FREE) {
    return data.defiIndex === -1 && data.defi ? data.defi : FREE_DEFIS[(data.defiIndex ?? 0) % FREE_DEFIS.length].title;
  }
  return data.defiIndex === -1 && data.defi ? data.defi : COOKING_DEFIS[(data.defiIndex ?? 0) % COOKING_DEFIS.length].title;
};

export const getLanguageTheme = (data: LanguageDefiData): string => {
  if ('language' in data && 'themeIndex' in data) {
    const theme = 'Voila {{theme}} en {{language}}, une langue {{school}}.';
    return replaceTokens(theme, {
      theme: data.themeIndex === null ? 'un défi' : LANGUAGE_THEMES[data.themeIndex % LANGUAGE_THEMES.length].title.toLowerCase(),
      language: capitalize(data.language),
      school: LANGUAGE_SCHOOL[(data.languageIndex - 1) % LANGUAGE_SCHOOL.length],
    });
  }
  return '';
};

export const isCooking = (activity: DefiActivity): activity is CookingDefiActivity => {
  return activity.subType === DEFI.COOKING;
};
export const isEco = (activity: DefiActivity): activity is EcoDefiActivity => {
  return activity.subType === DEFI.ECO;
};
export const isLanguage = (activity: DefiActivity): activity is LanguageDefiActivity => {
  return activity.subType === DEFI.LANGUAGE;
};
export const isFree = (activity: DefiActivity): activity is FreeDefiActivity => {
  return activity.subType === DEFI.FREE;
};

export function getDefiType(activity: DefiActivity): DefiTypeEnum {
  if (activity.subType !== null && activity.subType !== undefined) return defiTypeMap[activity.subType];
  else throw new Error(`Défi type is missing`);
}
