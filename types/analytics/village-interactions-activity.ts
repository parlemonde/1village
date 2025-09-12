import type { Country } from '../country.type';
import type { EngagementStatus } from '../statistics.type';

export interface VillageInteractionsActivity {
  id: number;
  countries: Country[];
  totalConnections: number;
  totalActivities: number;
  status: EngagementStatus;
}
