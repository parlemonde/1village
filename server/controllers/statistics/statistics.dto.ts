export interface StatisticsDto {
  childrenCodesCount: number;
  connectedFamiliesCount: number;
  familiesWithoutAccount: Array<any>;
  familyAccountsCount?: number;
  floatingAccounts?: Array<any>;
  exchanges: ExchangeDto;
}

export interface ExchangeDto {
  publicationsCount: number;
  commentsCount: number;
  videosCount: number;
}
