export interface ContributionStats {
  phase: number;
  activeClassrooms: string;
}

export interface ClassroomsStats {
  classroomId: number;
  classroomCountryCode: number;
  villageId: number;
  villageName: string;
  commentsCount: number;
  videosCount: number;
  userFirstName: number;
  userLastName: number;
  activitiesCount: {
    phase: number;
    activities: Record<string, number>;
  }[];
}
// TODO
// {
//   type: number;
//   count: number;
// }
export interface ClassroomExchangesStats {
  totalActivities: number;
  totalVideos: number;
  totalComments: number;
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

export interface ConnectionCountsStats {
  minConnections: number;
  maxConnections: number;
  averageConnections: number;
  medianConnections: number;
}
