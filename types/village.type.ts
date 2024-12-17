import type { Country } from './country.type';

export enum VillagePhase {
  DISCOVER = 1,
  EXCHANGE = 2,
  IMAGINE = 3,
}

export interface Village {
  id: number;
  name: string;
  countries: Country[];
  activePhase: VillagePhase;
  anthemId: number | null;
  plmId: number | null;
}

export interface VillageFilter {
  countryIsoCode: string;
}
