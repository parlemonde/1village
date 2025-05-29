export interface StatisticsDto {
  childrenCodesCount: number;
  connectedFamiliesCount: number;
  familiesWithoutAccount: Array<any>;
  familyAccountsCount?: number;
  floatingAccounts?: Array<any>;
  activityCountDetails: any;
}
