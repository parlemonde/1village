import { ChallengeActivity, CookingChallengeActivity } from './challenge.types';

export const COOKING_CHALLENGES = [
  {
    title: 'Réalisez notre recette à votre tour',
    description: 'Les Pelicopains devront créer une présentation sous forme de texte, son, image ou une vidéo',
  },
  {
    title: 'Présentez-nous une de vos recettes traditionnelles',
    description: 'Les Pelicopains devront créer une présentation sous forme de texte, son, image ou une vidéo',
  },
];

export const CHALLENGE = {
  COOKING: 0,
};

export const isCooking = (activity: ChallengeActivity): activity is CookingChallengeActivity => {
  return activity.subType === CHALLENGE.COOKING;
};
