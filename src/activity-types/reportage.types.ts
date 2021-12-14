import type { Activity } from 'types/activity.type';

export type ReportageData = {
  reportage?: string;
};

export type ReportageActivity = Activity<ReportageData>;
