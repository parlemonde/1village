import type { Country } from '../country.type';
import type { EngagementStatus } from '../statistics.type';

export interface VillageInteractionsActivity {
  id: number;
  villageId: number;
  countries: Country[];
  villageName: string;
  totalConnections: number;
  totalActivities: number;
  dominantStatus: EngagementStatus;
}
