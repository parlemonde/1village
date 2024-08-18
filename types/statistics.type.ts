export interface SessionsStats {
  minDuration: number;
  maxDuration: number;
  averageDuration: number;
  medianDuration: number;

  minConnections: number;
  maxConnections: number;
  averageConnections: number;
  medianConnections: number;
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
    activities: { count: number; type: number }[];
  }[];
}

export interface ConnectionsStats {
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
