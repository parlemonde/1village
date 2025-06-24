export interface StatisticsDto {
  family: {
    minDuration: number | null;
    maxDuration: number | null;
    averageDuration: number | null;
    medianDuration: number | null;

    minConnections: number | null;
    maxConnections: number | null;
    averageConnections: number | null;
    medianConnections: number | null;

    childrenCodesCount: number;
    connectedFamiliesCount: number;
    familiesWithoutAccount: Array<any>;
    familyAccountsCount?: number;
    floatingAccounts?: Array<any>;
  };
  activityCountDetails: any;
}
