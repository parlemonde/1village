import { DefiActivity, CookingDefiActivity, CookingDefiData } from './defi.types';

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

export const DEFI = {
  COOKING: 0,
};

export const getCookingDefi = (data: CookingDefiData): string => {
  return data.defiIndex === -1 && data.defi ? data.defi : COOKING_DEFIS[(data.defiIndex ?? 0) % COOKING_DEFIS.length].title;
};

export const isCooking = (activity: DefiActivity): activity is CookingDefiActivity => {
  return activity.subType === DEFI.COOKING;
};
