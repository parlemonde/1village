import type { EnigmeActivity } from './enigme.types';

export const ENIGME = {
  OBJET: 0,
  EVENEMENT: 1,
  PERSONALITE: 2,
  LIEU: 3,
};

export const ENIGME_TYPES = [
  {
    title: 'Objet mystère',
    title2: "L'objet mystère",
    title3: 'un objet mystère',
    titleStep1: 'Choisissez votre objet mystère',
    step2: "Description de l'objet",
    titleStep2: 'Décrivez votre objet mystère',
    titleStep2Short: 'objet',
    description: `La classe choisit de présenter un "objet mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Cet objet peut-être...`,
  },
  {
    title: 'Événement mystère',
    title2: "L'événement mystère",
    title3: 'un événement mystère',
    titleStep1: 'Choisissez votre événement mystère',
    step2: "Description de l'événement",
    titleStep2: 'Décrivez votre événement mystère',
    titleStep2Short: 'événement',
    description: `La classe choisit de présenter un "événement mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Cet événement peut-être une fête de l’école, un festival, un fait historique s'étant déroulé localement, une fête nationale...`,
  },
  {
    title: 'Personnalité mystère',
    title2: 'La personnalité mystère',
    title3: 'une personnalité mystère',
    titleStep1: 'Choisissez votre personnalité mystère',
    step2: 'Description de la personnalité',
    titleStep2: 'Décrivez votre personnalité mystère',
    titleStep2Short: 'personnalité',
    description: `La classe choisit de présenter une "personnalité mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Cette personnalité peut-être...`,
  },
  {
    title: 'Lieu mystère',
    title2: 'Le lieu mystère',
    title3: 'un lieu mystère',
    titleStep1: 'Choisissez votre lieu mystère',
    step2: 'Description du lieu',
    titleStep2: 'Décrivez votre lieu mystère',
    titleStep2Short: 'lieu',
    description: `La classe choisit de présenter un "lieu mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Ce lieu peut-être...`,
  },
];

export const ENIGME_DATA = [
  [
    {
      label: 'Un jouet',
      description: 'Faites nous découvrir un jouet mystère.',
      step: 'Un jouet',
    },
    {
      label: 'Un ustencile',
      description: 'Faites nous découvrir un ustencile.',
      step: 'Un ustencile',
    },
    {
      label: 'Un objet de culte',
      description: 'Faites nous découvrir un objet de culte.',
      step: 'Un objet de culte',
    },
    {
      label: 'Un instrument de musique',
      description: 'Faites nous découvrir un instrument de musique.',
      step: 'Un instrument de musique',
    },
    {
      label: 'Un costume',
      description: 'Faites nous découvrir un costume mystère.',
      step: 'Un costume',
    },
  ],
  [
    {
      label: 'Une fête de l’école',
      description: 'Faites nous découvrir les jours de fêtes de votre école.',
      step: 'Une fête',
    },
    {
      label: 'Un festival',
      description: 'Et si vous tentiez de nous faire découvrir un festival typique de chez vous ?',
      step: 'Un festival',
    },
    {
      label: 'Un fait historique',
      description: 'Présentez ici un fait historique s’étant déroulé dans votre région.',
      step: 'Un fait historique',
    },
    {
      label: 'Une fête nationale',
      description: 'Faites nous découvrir une fête de votre pays.',
      step: 'Une fête nationale',
    },
  ],
  [
    {
      label: 'Un personnage historique',
      description: 'Faites nous découvrir un personnage historique.',
      step: 'Un personnage historique',
    },
    {
      label: 'Un personnage de fiction',
      description: 'Faites nous découvrir un personnage de fiction.',
      step: 'Un personnage de fiction',
    },
    {
      label: 'Un personnage contemporain',
      description: 'Faites nous découvrir un personnage contemporain.',
      step: 'Un personnage contemporain',
    },
  ],
  [
    {
      label: 'Un monument commémoratif',
      description: 'Faites nous découvrir un monument commémoratif.',
      step: 'Un monument commémoratif',
    },
    {
      label: 'Un édifice remarquable',
      description: 'Faites nous découvrir un édifice remarquable.',
      step: 'Un édifice remarquable',
    },
    {
      label: 'Une salle de spectacle',
      description: 'Faites nous découvrir une salle de spectacle.',
      step: 'Une salle de spectacle',
    },
    {
      label: "Un ouvrage d'art",
      description: "Faites nous découvrir un ouvrage d'art.",
      step: "Un ouvrage d'art",
    },
  ],
];

export function getEnigmeTimeLeft(activity: EnigmeActivity): number {
  return 7 - Math.floor((new Date().getTime() - (activity.data.timer ?? new Date(activity.updateDate || '').getTime())) / 3600000 / 24);
}
