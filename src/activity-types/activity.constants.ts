import { DEFI } from './defi.constants';
import { ENIGME } from './enigme.constants';
import { INDICE } from './indice.constants';
import { REPORTAGE } from './reportage.constants';
import { SYMBOL } from './symbol.constants';
import { ActivityType } from 'types/activity.type';

type ActivityTypeKey = keyof typeof ActivityType;

export const getType = (typeValue: number): string | undefined => {
  const type = Object.keys(ActivityType).find((key) => ActivityType[key as ActivityTypeKey] === typeValue);
  return type;
};

const SUBTYPE_MAPPER: Record<string, Record<string, number>> = {
  ENIGME,
  INDICE,
  SYMBOL,
  DEFI,
  REPORTAGE,
};
export const getSubtype = (typeName: string, subTypeValue: number): string | undefined => {
  const result = Object.keys(SUBTYPE_MAPPER[typeName] || {}).find((key) => SUBTYPE_MAPPER[typeName][key] === subTypeValue);
  return result;
};
