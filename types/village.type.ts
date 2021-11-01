import type { Country } from './country.type';

export const VillagePhase = {
  DISCOVER: 1,
  EXCHANGE: 2,
  IMAGINE: 3,
};

export interface Village {
  id: number;
  name: string;
  countries: Country[];
  activePhase: number;
}
