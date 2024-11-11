export interface ClassroomStats {
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

export interface Phases {
  data: Record<string, string | number>[];
  phase: string;
}

interface Data {
  name: string;
  type6?: string;
  type2?: string;
}

export interface ClassroomsStats {
  data: ClassroomStats[];
  phases: Phases[];
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
