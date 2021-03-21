export const ENIGME = {
  OBJET: 0,
  EVENEMENT: 1,
  PERSONALITE: 2,
};

export const ENIGME_TYPES = [
  {
    title: 'Objet mystère',
    titleStep1: 'Choisissez votre objet mystère',
    step2: "Description de l'objet",
    titleStep2: 'Décrivez votre objet mystère',
    titleStep2Short: 'objet',
    description: `La classe choisit de présenter un "objet mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Cet objet peut-être...`,
  },
  {
    title: 'Événement mystère',
    titleStep1: 'Choisissez votre événement mystère',
    step2: "Description de l'événement",
    titleStep2: 'Décrivez votre événement mystère',
    titleStep2Short: 'événement',
    description: `La classe choisit de présenter un "événement mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Cet événement peut-être une fête de l’école, un festival, un fait historique s'étant déroulé localement, une fête nationale...`,
  },
  {
    title: 'Personalité mystère',
    titleStep1: 'Choisissez votre personalité mystère',
    step2: 'Description de la personalité',
    titleStep2: 'Décrivez votre personalité mystère',
    titleStep2Short: 'personalité',
    description: `La classe choisit de présenter une "personalité mystère", à travers une énigme sous forme de texte, de son, d'image ou de vidéo. Cette personalité peut-être...`,
  },
];

export const ENIGME_DATA = [
  [
    {
      label: 'Une fête de l’école',
      description: 'Faites nous découvrir les jours de fêtes de votre école.',
      step: 'Une Fête',
    },
    {
      label: 'Autre',
      description: 'Présentez un objet culturel mystère d’une autre catégorie.',
      step: 'Autre',
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
    {
      label: 'Autre',
      description: 'Présentez un événement mystère d’une autre catégorie.',
      step: 'Autre',
    },
  ],
  [
    {
      label: 'Une fête de l’école',
      description: 'Faites nous découvrir les jours de fêtes de votre école.',
      step: 'Une Fête',
    },
    {
      label: 'Autre',
      description: 'Présentez une personalité mystère d’une autre catégorie.',
      step: 'Autre',
    },
  ],
];
