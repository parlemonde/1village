import type { ClassroomStat, EngagementStatusData, SessionsStats, VillageStats } from './statistics.type';

export enum DashboardSummaryTab {
  CLASSROOM = 1,
  FAMILY = 2,
}

export interface ContributionBarChartData {
  total: number;
  dataBySteps: ContributionBySteps[];
}

export interface ContributionBySteps {
  step: string;
  contributionCount: number;
}

export interface BarChartData {
  value: number;
  isSelected: boolean;
}

export interface BarChartDataByMonth {
  month: string;
  barChartData: BarChartData[];
}

export interface PieChartDataItem {
  value: number;
  label: string;
  color: string;
}

export interface PieChartData {
  engagementStatusData?: EngagementStatusData[];
}

export interface AverageStatsData {
  min?: number;
  max?: number;
  average?: number;
  median?: number;
}

export enum AverageStatsProcessingMethod {
  NO_PROCESSING = 0,
  BY_MIN = 1,
}

export interface DashboardSummaryData extends SessionsStats, ClassroomStat, VillageStats, PieChartData {}

export enum DashboardType {
  ONE_VILLAGE_PANEL,
  COMPLETE,
}
