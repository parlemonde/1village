import type { IndiceData } from './indice.types';

export const INDICE = {
  PAYSAGE: 0,
  ARTS: 1,
  LIEUX_DE_VIES: 2,
  LANGUES: 3,
  FAUNE_FLORE: 4,
  LOISIRS: 5,
  CUISINES: 6,
  TRADITIONS: 7,
};

export const INDICE_TYPES = [
  {
    title: 'Paysages',
    step1: 'Nos paysages',
  },
  {
    title: 'Arts',
    step1: 'Nos arts',
  },
  {
    title: 'Lieux de vies',
    step1: 'Nos lieux de vies',
  },
  {
    title: 'Langues',
    step1: 'Nos langues',
  },
  {
    title: 'Faune et flore',
    step1: 'Notre faune et flore',
  },
  {
    title: 'Loisirs et jeux',
    step1: 'Nos loisirs et jeux',
  },
  {
    title: 'Cuisines',
    step1: 'Nos cuisines',
  },
  {
    title: 'Traditions',
    step1: 'Nos traditions',
  },
];

export const getIndice = (activitySubType: number | null | undefined, activityData: IndiceData) =>
  (activitySubType === -1 ? { title: activityData.indice || '', step1: activityData.indice || '' } : INDICE_TYPES[activitySubType || 0]) || {
    title: 'Indice',
    step1: 'Indice',
  };
