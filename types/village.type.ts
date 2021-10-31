import type { Country } from './country.type';

export interface Village {
  id: number;
  name: string;
  countries: Country[];
  activePhase: number;
}
