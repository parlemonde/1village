import type {
  LanguageDefiData,
  DefiActivity,
  CookingDefiActivity,
  CookingDefiData,
  EcoDefiActivity,
  EcoDefiData,
  LanguageDefiActivity,
  FreeDefiActivity,
  FreeDefiData,
} from './defi.types';
import { capitalize, replaceTokens } from 'src/utils';

export const COOKING_DEFIS = [
  {
    title: 'Réalisez notre recette à votre tour',
    description: 'Les Pelicopains devront créer une présentation sous forme de texte, son, image ou une vidéo',
  },
  {
    title: 'Présentez-nous une de vos recettes traditionnelles',
    description: 'Les Pelicopains devront créer une présentation sous forme de texte, son, image ou une vidéo',
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
    description: 'Les Pelicopains devront refaire votre action chez eux',
  },
  {
    title: 'Imaginer et réaliser  une nouvelle action pour la planète',
    description: 'Les Pelicopains devront réaliser une autre action',
  },
];
export const LANGUAGE_SCHOOL = [
  'maternelle chez tous les élèves',
  'maternelle chez certains élèves',
  'qu’on utilise pour faire cours',
  'qu’on apprend comme langue étrangère',
];
export const LANGUAGE_THEMES = [
  {
    title: 'Un mot précieux',
    title2: 'le mot précieux',
    desc1: "Choisissez un mot 'précieux' qui a quelque chose d'original (prononciation,origine...) dans la langue {{language}}.",
    desc2: 'Expliquez pourquoi vous avez choisi ce mot précieux, ce qu’il signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une expression',
    title2: "l'expression",
    desc1: 'Choisissez une expression surprenante dans la langue {{language}}.',
    desc2: 'Expliquez pourquoi vous avez choisi cette expression, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une poésie',
    title2: 'la poésie',
    desc1: 'Choisissez une poésie écrite dans la langue {{language}}.',
    desc2: 'Expliquez pourquoi vous avez choisi cette poésie, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une chanson',
    title2: 'la chanson',
    desc1: 'Choisissez une chanson écrite dans la langue {{language}}.',
    desc2: 'Expliquez pourquoi vous avez choisi cette chanson, ce qu’elle signifie et quand vous l’utilisez.',
  },
];
export const LANGUAGE_DEFIS = [
  {
    title: 'Trouvez {{theme}} similaire dans une autre langue',
    description: 'Les Pelicopains devront envoyer un texte, un son ou une vidéo.',
  },
  {
    title: 'Répétez à l’oral {{theme}} en {{language}}',
    description: 'Les Pelicopains devront envoyer un son ou une vidéo.',
  },
  {
    title: 'Écrivez {{theme}} en {{language}}',
    description: 'Les Pelicopains devront envoyer un texte, une image ou une vidéo.',
  },
];

export const FREE_DEFIS = [
  {
    title: 'Réalisez notre action à votre tour',
    description: 'Les Pelicopains devront réaliser la même action que vous',
  },
  {
    title: 'Réalisez une autre action sur le même thème',
    description: 'Les Pelicopains devront réaliser une action sur le thème {{theme}}',
  },
];
export const DEFI = {
  COOKING: 0,
  ECO: 1,
  LANGUAGE: 2,
  FREE: 3,
};

//TODO : factoriser en mode clean code le getDefi
//https://stackoverflow.com/questions/8900652/what-does-do-in-javascript
export const getDefi = (subtype: number, data: CookingDefiData | EcoDefiData | LanguageDefiData | FreeDefiData): string => {
  if (subtype === DEFI.ECO) {
    return data.defiIndex === -1 && data.defi ? data.defi : ECO_DEFIS[(data.defiIndex ?? 0) % ECO_DEFIS.length].title;
  }
  if (subtype === DEFI.LANGUAGE && 'language' in data && 'themeIndex' in data) {
    const defi = data.defiIndex !== null ? LANGUAGE_DEFIS[data.defiIndex].title : '';
    return replaceTokens(defi, {
      theme: data.themeIndex !== null ? LANGUAGE_THEMES[data.themeIndex].title2.toLowerCase() : "< thème choisi à l'étape 2 >",
      language: data.languageCode.length > 0 ? data.languageCode : "< langue choisie à l'étape 1 >",
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
