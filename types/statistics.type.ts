import type { VillagePhase } from './village.type';

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
  phases?: Phases[];
}

export type ClassroomStats = Omit<VillageStats, 'floatingAccounts' | 'familyAccountsCount'>;

export interface Phases {
  data: Record<string, string | number>[];
  phase: string;
}

export interface ClassroomStat {
  data: ClassroomsStats[];
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

export interface VillageStats {
  childrenCodesCount: number;
  familyAccountsCount: number;
  connectedFamiliesCount: number;
  familiesWithoutAccount: FamiliesWithoutAccount[];
  floatingAccounts: FloatingAccount[];
}

export interface FamiliesWithoutAccount {
  student_id: number;
  student_firstname: string;
  student_lastname: string;
  student_creation_date: string | null;
  village_name: string;
  classroom_name: string;
  classroom_country: string;
}

export interface FloatingAccount {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  language: string;
  createdAt: string | null;
}

export interface OneVillageTableRow {
  id: string | number;
  [key: string]: string | boolean | number | React.ReactNode;
}

export type StatsFilterParams = {
  villageId: number | undefined;
  classroomId: number | undefined;
  countryId: string | undefined;
  phase: VillagePhase | undefined;
};

export type WhereClause = {
  clause: string;
  value: object;
};
