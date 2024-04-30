export interface ContributionStats {
  phase: number;
  activeClassrooms: string;
}

export interface StudentAccountsStats {
  totalStudentAccounts: number;
  classWithStudentAccounts: number;
  connectedFamilies: number;
}

export interface ConnectionTimesStats {
  minDuration: number;
  maxDuration: number;
  averageDuration: number;
  medianDuration: number;
}
