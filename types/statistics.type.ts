import type { PhaseDetail } from '../src/api/statistics/compare.api';
import type { BarChartDataByMonth } from './dashboard.type';
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
  barChartData: BarChartDataByMonth[];
}

export interface VillageStats {
  family: {
    minDuration: number;
    maxDuration: number;
    medianDuration: number;
    averageDuration: number;

    minConnections: number;
    maxConnections: number;
    averageConnections: number;
    medianConnections: number;

    childrenCodesCount: number;
    familyAccountsCount: number;
    connectedFamiliesCount: number;
    familiesWithoutAccount: FamiliesWithoutAccount[];
    floatingAccounts: FloatingAccount[];
  };
  activityCountDetails: Array<{
    villageName: string;
    classrooms: Array<{
      name: string;
      classroomId: string | null;
      totalPublications: number;
      classroomName: string;
      countryCode: string;
      phaseDetails: Array<{
        phaseId: number;
        commentCount: number;
        draftCount: number;
        mascotCount?: number;
        videoCount?: number;
        challengeCount?: number;
        enigmaCount?: number;
        gameCount?: number;
        questionCount?: number;
        reactionCount?: number;
        reportingCount?: number;
        storyCount?: number;
        anthemCount?: number;
        reinventStoryCount?: number;
        contentLibreCount?: number;
        [key: string]: unknown;
      }>;
    }>;
  }>;
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
  villageId?: number;
  classroomId?: number;
  countryId?: string;
  phase?: VillagePhase;
  groupType?: GroupType;
};

export type WhereClause = {
  clause: string;
  value: object;
};

export enum GroupType {
  CLASSROOM,
  FAMILY,
  All,
}

export type ClassroomActivity = {
  name: string;
  countryCode: string;
  classroomId: string;
  totalPublications: number;
  phaseDetails: PhaseDetail[];
};

export type VillageActivity = {
  villageName: string;
  classrooms: ClassroomActivity[];
};

export interface StatisticsDto {
  family: {
    minDuration: number;
    maxDuration: number;
    averageDuration: number;
    medianDuration: number;
    minConnections: number;
    maxConnections: number;
    averageConnections: number;
    medianConnections: number;
    familyAccountsCount: number;
    childrenCodesCount: number;
    connectedFamiliesCount: number;
    floatingAccounts: FloatingAccount[];
  };
  activityCountDetails: Array<{
    villageName: string;
    classrooms: Array<{
      name: string;
      classroomId: string | null;
      totalPublications: number;
      classroomName: string;
      countryCode: string;
      phaseDetails: Array<{
        phaseId: number;
        commentCount: number;
        draftCount: number;
        mascotCount?: number;
        videoCount?: number;
        challengeCount?: number;
        enigmaCount?: number;
        gameCount?: number;
        questionCount?: number;
        reactionCount?: number;
        reportingCount?: number;
        storyCount?: number;
        anthemCount?: number;
        reinventStoryCount?: number;
        contentLibreCount?: number;
        [key: string]: unknown;
      }>;
    }>;
  }>;
}
