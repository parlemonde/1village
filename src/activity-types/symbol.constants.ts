import type { SymbolData } from './symbol.types';

export const SYMBOL = {
  DRAPEAU: 0,
  EMBLEME: 1,
  FLEUR: 2,
  DEVISE: 3,
  HYMNE: 4,
  ANIMAL: 5,
  FIGURE: 6,
  MONNAIE: 7,
};

const SYMBOL_TYPES = [
  {
    title: 'Drapeau',
    step1: 'Un drapeau',
  },
  {
    title: 'Emblème',
    step1: 'Un emblème',
  },
  {
    title: 'Fleur nationale',
    step1: 'Une fleur nationale',
  },
  {
    title: 'Devise',
    step1: 'Une devise',
  },
  {
    title: 'Hymne',
    step1: 'Un hymne',
  },
  {
    title: 'Animal',
    step1: 'Un animal national',
  },
  {
    title: 'Figure',
    step1: 'Une figure symbolique',
  },
  {
    title: 'Monnaie',
    step1: 'Une monnaie',
  },
];

export const getSymbol = (activitySubType: number | null | undefined, activityData: SymbolData) =>
  (activitySubType === -1 ? { title: activityData.symbol || '', step1: activityData.symbol || '' } : SYMBOL_TYPES[activitySubType || 0]) || {
    title: 'Symbole',
    step1: 'Symbole',
  };
