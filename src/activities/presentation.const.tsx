import { MascotteData } from './presentation.types';

export const PRESENTATION_THEMATIQUE = [
  {
    label: 'Présentation de l’école',
    description: 'Présentez votre école à vos Pélicopains',
    title: 'Faites une présentation libre de votre école',
    cardTitle: 'Présentation de notre école',
  },
  {
    label: 'Présentation de votre environnement',
    description: 'Présentez vos paysages, votre nature à vos Pélicopains',
    title: 'Faites une présentation libre de votre environnement',
    cardTitle: 'Présentation de notre environnement',
  },
  {
    label: 'Présentation de votre lieu de vie',
    description: 'Présentez votre ville/village/quartier à vos Pélicopains',
    title: 'Faites une présentation libre de votre lieu de vie',
    cardTitle: 'Présentation de notre lieu de vie',
  },
  {
    label: 'Présentation d’un loisir',
    description: 'Présentez votre activité préférée à vos Pélicopains',
    title: 'Faites une présentation libre d’un loisir',
    cardTitle: 'Présentation d’un loisir',
  },
  {
    label: 'Présentation d’un plat',
    description: 'Présentez votre plat préféré ou emblématique à vos Pélicopains',
    title: 'Faites une présentation libre d’un plat',
    cardTitle: 'Présentation d’un plat',
  },
  {
    label: 'Présentation libre',
    description: 'Faites une présentation libre',
    title: 'Faites une présentation libre',
    cardTitle: 'Présentation libre',
  },
];

export const DEFAULT_MASCOTTE_DATA: MascotteData = {
  presentation: '',
  totalStudent: 0,
  girlStudent: 0,
  boyStudent: 0,
  meanAge: 0,
  totalTeacher: 0,
  womanTeacher: 0,
  manTeacher: 0,
  numberClassroom: 0,
  totalSchoolStudent: 0,
  mascotteName: '',
  mascotteImage: '',
  mascotteDescription: '',
  personality1: '',
  personality2: '',
  personality3: '',
  countries: [],
  languages: [],
  currencies: [],
};
