export interface ClassroomsStats {
  classroomId: number;
  classroomCountryCode: string;
  villageId: number;
  villageName: string;
  userFirstName: number;
  userLastName: number;
  commentsCount: number;
  videosCount: number;
  activities: { count: number; type: number; phase: number }[];
}

export interface SessionsStats {
  minDuration: number;
  maxDuration: number;
  medianDuration: number;
  averageDuration: number;

  minConnections: number;
  maxConnections: number;
  medianConnections: number;
  averageConnections: number;

  registeredClassroomsCount: number;
  connectedClassroomsCount: number;
  contributedClassroomsCount: number;
}

export interface VillageStats {
  childrenCodesCount: number;
  familyAccountsCount: number;
  connectedFamiliesCount: number;
  familiesWithoutAccount: FamiliesWithoutAccount[];
}

export interface FamiliesWithoutAccount {
  student_id: number;
  student_firstname: string;
  student_lastname: string;
  village_name: string;
  classroom_name: string;
  classroom_country: string;
}
