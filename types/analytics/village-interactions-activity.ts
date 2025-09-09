import type { Country } from '../country.type';

export interface VillageInteractionsActivity {
  id: number;
  countries: Country[];
  totalConnections: number;
  totalActivities: number;
  status: VillageInteractionsStatus;
}

export enum VillageInteractionsStatus {
  ACTIVE = 'active',
  OBSERVER = 'observer',
  GHOST = 'ghost',
}
