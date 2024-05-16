import type { Country } from '../../types/country.type';
import { countries } from './iso-3166-countries-french';

export const countriesMap = countries.reduce<Record<string, Country>>((acc, c) => {
  acc[c.isoCode] = c;
  return acc;
}, {});
