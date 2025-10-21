import type { Country } from './country.type';
import type { ContributionBarChartData } from './dashboard.type';
import type { User } from './user.type';
import type { Village, VillagePhase } from './village.type';

export interface ClassroomDetails {
  id: number;
  classroomName?: string;
  countryCode: string;
  villageName: string;
  commentsCount: number;
  videosCount: number;
}

export interface ClassroomStat extends ClassroomDetails {
  villageId: number;
  userFirstName: number;
  userLastName: number;
  activities: { count: number; type: number; phase: number }[];
  phases?: Phases[];
}

export type ClassroomStats = Omit<VillageStats, 'floatingAccounts' | 'familyAccountsCount'>;

export interface Phases {
  data: Record<string, string | number>[];
  phase: string;
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
  dailyConnectionsCountsByMonth: DailyConnectionsCountsByMonth[];
  contributionsBarChartData: ContributionBarChartData;
}

type ActivityCountDetails = {
  villageName: string;
  classrooms: ClassroomCountDetails[];
};

export type ClassroomCountDetails = {
  id: number;
  name: string;
  phaseDetails: PhaseDetails;
};

export type CountryCountDetails = {
  countryCode: string;
  phaseDetails: PhaseDetails;
};

export type VillageCountDetails = {
  id: number;
  name: string;
  phaseDetails: PhaseDetails;
};

export type CountryContribution = {
  countryCode: string;
  countryName: string;
  total: number;
};

export type VillageClassroomsContribution = {
  classroomId: number;
  classroomName: string;
  countryCode: string;
  total: number;
};

export type CountryClassroomsContribution = {
  countryCode: string;
  countryName: string;
  classroomsContributions: Omit<VillageClassroomsContribution, 'countryCode'>[];
};

export type PhaseDetails = {
  phaseId: number;
  commentCount: number;
  draftCount: number;
  indiceCount?: number;
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
  contentLibreCount?: number;
  reinventStoryCount?: number;
};

interface FamillyStats
  extends Omit<SessionsStats, 'registeredClassroomsCount' | 'connectedClassroomsCount' | 'contributedClassroomsCount' | 'barChartData'> {
  childrenCodesCount: number;
  familyAccountsCount: number;
  connectedFamiliesCount: number;
  familiesWithoutAccount: FamiliesWithoutAccount[];
  floatingAccounts: FloatingAccount[];
}

export interface VillageStats {
  family: FamillyStats;
  activityCountDetails: ActivityCountDetails[];
  totalActivityCounts: {
    totalPublications: number;
    totalComments: number;
    totalVideos: number;
  };
  contributionsByCountry: CountryContribution[];
  contributionsByCountryClassrooms?: CountryClassroomsContribution[];
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

export interface DailyConnectionsCountsByMonth {
  readonly monthLabel: string;
  readonly counts: number[];
}

export type VillageActivity = {
  villageName: string;
  classrooms: ClassroomCountDetails[];
};

export interface StatisticsDto {
  family: Omit<FamillyStats, 'familiesWithoutAccount'>;
  activityCountDetails: ActivityCountDetails[];
}

export enum ClassroomMonitoringStatus {
  NO_CONNECTION_SINCE_FIRST = '0',
  THREE_WEEK_WITHOUT_CONNECTION = '1',
  AT_LEAST_THREE_DRAFTS_IN_PROGRESS = '2',
}

export interface ClassroomToMonitor {
  id: number;
  name: string;
  vm: string;
  teacher: string;
  status: ClassroomMonitoringStatus;
  user: User;
}

export interface EngagementStatusParams {
  countryCode?: string;
  villageId?: Village['id'];
}

export interface EngagementStatusData {
  status: EngagementStatus;
  statusCount: number;
}

export interface CountryEngagementStatus {
  countryCode: string;
  status: EngagementStatus;
}

export enum EngagementStatus {
  GHOST = 'ghost',
  OBSERVER = 'observer',
  ACTIVE = 'active',
}

export enum EngagementStatusColor {
  GHOST = '#FFD678',
  OBSERVER = '#6082FC',
  ACTIVE = '#4CC64A',
  DEFAULT = '#FFF',
}

export interface ClassroomIdentityDetails {
  school: string;
  country: Country | null;
  email: string;
  firstname: string;
  lastname: string;
  city: string;
  postalCode: string;
  address: string;
  position: {
    lat: number;
    lng: number;
  };
  village: string;
  lastConnexion: string | Date;
}
