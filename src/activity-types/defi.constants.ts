import { replaceTokens } from 'src/utils';

import type {
  DefiActivity,
  CookingDefiActivity,
  CookingDefiData,
  EcoDefiActivity,
  EcoDefiData,
  LanguageDefiActivity,
  LanguageDefiData,
} from './defi.types';

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
export const LANGUAGE_OBJECTS = [
  {
    title: 'Un mot trésor',
    title2: 'le mot trésor',
    desc1: 'Écrivez en {{language}} le mot trésor que vous avez choisi.',
    desc2: 'Expliquez pourquoi vous avez choisi ce mot trésor, ce qu’il signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une expression',
    title2: "l'expression",
    desc1: "Écrivez en {{language}} l'expression que vous avez choisie.",
    desc2: 'Expliquez pourquoi vous avez choisi cette expression, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une poésie',
    title2: 'la poésie',
    desc1: 'Écrivez en {{language}} la poésie que vous avez choisie.',
    desc2: 'Expliquez pourquoi vous avez choisi cette poésie, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Une chanson',
    title2: 'la chanson',
    desc1: 'Écrivez en {{language}} la chanson que vous avez choisie.',
    desc2: 'Expliquez pourquoi vous avez choisi cette chanson, ce qu’elle signifie et quand vous l’utilisez.',
  },
  {
    title: 'Autre',
    title2: '',
    desc1: 'Écrivez en {{language}} ce que vous avez choisi.',
    desc2: 'Expliquez pourquoi votre choix, ce qu’il signifie et quand vous l’utilisez.',
  },
];
export const LANGUAGE_DEFIS = [
  {
    title: 'Trouvez {{object}} qui veut dire la même chose dans une autre langue',
    description: 'Les Pelicopains devront envoyer un texte, un son ou une vidéo.',
  },
  {
    title: 'Répétez à l’oral {{object}} en {{language}}',
    description: 'Les Pelicopains devront envoyer un son ou une vidéo.',
  },
  {
    title: 'Écrivez {{object}} en {{language}}',
    description: 'Les Pelicopains devront envoyer une image ou une vidéo.',
  },
];

export const DEFI = {
  COOKING: 0,
  ECO: 1,
  LANGUAGE: 2,
};

export const getDefi = (subtype: number, data: CookingDefiData | EcoDefiData | LanguageDefiData): string => {
  if (subtype === DEFI.ECO) {
    return data.defiIndex === -1 && data.defi ? data.defi : ECO_DEFIS[(data.defiIndex ?? 0) % ECO_DEFIS.length].title;
  }
  if (subtype === DEFI.LANGUAGE) {
    const defi = data.defiIndex === -1 && data.defi ? data.defi : LANGUAGE_DEFIS[(data.defiIndex ?? 0) % LANGUAGE_DEFIS.length].title;
    if ((data as LanguageDefiData).objectIndex === -1) {
      return '';
    }
    if ((data as LanguageDefiData).objectIndex === 4 && data.defiIndex === 0) {
      return 'Trouvez la même chose dans une autre langue';
    }
    return replaceTokens(defi, {
      object:
        data.defiIndex === 0
          ? LANGUAGE_OBJECTS[(data as LanguageDefiData).objectIndex % LANGUAGE_OBJECTS.length].title.toLowerCase()
          : LANGUAGE_OBJECTS[(data as LanguageDefiData).objectIndex % LANGUAGE_OBJECTS.length].title2,
      language: (data as LanguageDefiData).language,
    });
  }
  return data.defiIndex === -1 && data.defi ? data.defi : COOKING_DEFIS[(data.defiIndex ?? 0) % COOKING_DEFIS.length].title;
};

export const getLanguageObject = (data: LanguageDefiData): string => {
  const object = 'Voila {{object}} en {{language}}, une langue {{school}}.';
  return replaceTokens(object, {
    object:
      data.objectIndex === -1 || data.objectIndex === 4
        ? 'un défi'
        : LANGUAGE_OBJECTS[data.objectIndex % LANGUAGE_OBJECTS.length].title.toLowerCase(),
    language: data.language,
    school: LANGUAGE_SCHOOL[(data.languageIndex - 1) % LANGUAGE_SCHOOL.length],
  });
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
