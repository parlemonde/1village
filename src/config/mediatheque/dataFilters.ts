// Ces const sont utilisées pour l'affichage des filtres dans la médiathèque pour les activités

export const activitiesLabel = ['Indice', 'Mascotte', 'Reportage', 'Défis', 'Jeux', 'Enigme', 'Couplet', 'Réinventer une histoire'];

export const themeOfIndice = [
  'Paysages',
  'Arts',
  'Lieux de vies',
  'Langues',
  'Flore et faune',
  'Loisirs et jeux',
  'Cuisines',
  'Traditions',
  'Drapeau',
  'Emblème',
  'Fleur nationale',
  'Devise',
  'Hymne',
  'Animal national',
  'Figure symbolique',
  'Monnaie',
  'Autre',
];

export const themeOfDefi = ['Culinaire', 'Linguistique', 'Ecologique', 'Libre'];

export const themeOfJeux = ['Jeu des mimiques', 'Jeu de la monnaie', 'Jeu des expressions'];

export const themeOfEnigme = ['Evenement mystère', 'Lieu mystère', 'Objet mystère', 'Personnalité mystère', 'autre'];

export const themeOfReportage = ['Paysages', 'Arts', 'Ecoles', 'Langues', 'Flore et faune', 'Loisirs et jeux', 'Cuisines', 'Traditions', 'Autre'];

export const subThemesMap: { [key: string]: string[] } = {
  Indice: themeOfIndice,
  Défis: themeOfDefi,
  Jeux: themeOfJeux,
  Enigme: themeOfEnigme,
  Reportage: themeOfReportage,
};

// Ces const sont utilisées pour la logique des filtres dans la médiathèque pour les activités

export const activityNumberMapper: { [key: string]: number } = {
  Indice: 6,
  Mascotte: 8,
  Reportage: 9,
  Défis: 2,
  Jeux: 4,
  Enigme: 1,
  Couplet: 12,
  'Réinventer une histoire': 14,
};

export const activityNameMapper: { [key: number]: string } = {
  6: 'Indice',
  8: 'Mascotte',
  9: 'Reportage',
  2: 'Défis',
  4: 'Jeux',
  1: 'Enigme',
  12: 'Couplet',
  14: 'Réinventer une histoire',
};

export const subThemeNumberMapper: { [key: string]: number } = {
  Paysages: 0,
  Arts: 1,
  'Lieux de vies': 2,
  Langues: 3,
  'Flore et faune': 4,
  'Loisirs et jeux': 5,
  Cuisines: 6,
  Traditions: 7,
  Autre: -1,
  Drapeau: 0,
  Emblème: 1,
  'Fleur nationale': 2,
  Devise: 3,
  Hymne: 4,
  'Animal national': 5,
  'Figure symbolique': 6,
  Monnaie: 7,
  Culinaire: 0,
  Linguistique: 2,
  Ecologique: 1,
  Libre: 3,
  'Jeu des mimiques': 0,
  'Jeu de la monnaie': 1,
  'Jeu des expressions': 2,
  'Evenement mystère': 0,
  'Lieu mystère': 1,
  'Objet mystère': 2,
  'Personnalité mystère': 3,
  Ecoles: 3,
};
