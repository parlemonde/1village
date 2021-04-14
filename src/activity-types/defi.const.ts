import { DefiActivity, CookingDefiActivity, CookingDefiData, EcoDefiActivity, EcoDefiData } from './defi.types';

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

export const getCookingDefi = (data: CookingDefiData): string => {
  return data.defiIndex === -1 && data.defi ? data.defi : COOKING_DEFIS[(data.defiIndex ?? 0) % COOKING_DEFIS.length].title;
};
export const getEcoDefi = (data: EcoDefiData): string => {
  return data.defiIndex === -1 && data.defi ? data.defi : ECO_DEFIS[(data.defiIndex ?? 0) % ECO_DEFIS.length].title;
};

export const DEFI = {
  COOKING: 0,
  ECO: 1,
};

export const isCooking = (activity: DefiActivity): activity is CookingDefiActivity => {
  return activity.subType === DEFI.COOKING;
};
export const isEco = (activity: DefiActivity): activity is EcoDefiActivity => {
  return activity.subType === DEFI.ECO;
};
