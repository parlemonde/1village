import { DEFI } from './defi.constants';
import { ENIGME } from './enigme.constants';
import { INDICE } from './indice.constants';
import { REPORTAGE } from './reportage.constants';
import { SYMBOL } from './symbol.constants';
import { ActivityType } from 'types/activity.type';

export const getType = (typeValue: number): string | undefined => {
  const type = Object.keys(ActivityType).find((key) => ActivityType[key] === typeValue);
  return type;
};

const SUBTYPE_MAPPER = {
  ENIGME: ENIGME,
  INDICE: INDICE,
  SYMBOL: SYMBOL,
  DEFI: DEFI,
  REPORTAGE: REPORTAGE,
};
export const getSubtype = (typeName: string, subTypeValue: number): string | undefined => {
  const result = Object.keys(SUBTYPE_MAPPER[typeName] || {}).find((key) => SUBTYPE_MAPPER[typeName][key] === subTypeValue);
  return result;
};
