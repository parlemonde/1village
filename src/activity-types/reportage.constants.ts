import type { ReportageData } from './reportage.types';

export const REPORTAGE = {
  PAYSAGE: 0,
  ARTS: 1,
  LIEUX_DE_VIES: 2,
  LANGUES: 3,
  FAUNE_FLORE: 4,
  LOISIRS: 5,
  CUISINES: 6,
  TRADITIONS: 7,
};

export const REPORTAGE_TYPES = [
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

export const getReportage = (activitySubType: number | null | undefined, activityData: ReportageData) =>
  (activitySubType === -1 ? { title: activityData.reportage || '', step1: activityData.reportage || '' } : REPORTAGE_TYPES[activitySubType || 0]) || {
    title: 'Reportage',
    step1: 'Reportage',
  };

// eslint-disable-next-line no-console
console.log('getReportage', getReportage);
