import type { PhaseDetails } from '../../../types/statistics.type';

export type ClassroomCompareData = {
  id: number;
  name: string;
  phaseDetails: CleanedEntityActivityCounts;
};

export type VillageCompareData = {
  id: number;
  name: string;
  phaseDetails: CleanedEntityActivityCounts;
};

export type CountryCompareData = {
  countryCode: string;
  phaseDetails: CleanedEntityActivityCounts;
};

export type ComparePhaseDetail = Omit<PhaseDetails, 'commentCount' | 'draftCount'> & {
  commentCount?: number;
  draftCount?: number;
};

export type PhaseTableRow = Omit<ComparePhaseDetail, 'phaseId'> & {
  id: string | number;
  name: string;
  isSelected?: boolean;
};

export type CleanedEntityActivityCounts = Omit<PhaseData, 'phaseId'> & {
  id: string;
  name: string;
  isSelected: boolean;
};

export type PhaseData = {
  phaseId: number;
  commentCount: number;
  draftCount: number;
  indiceCount: number;
  mascotCount: number;
  videoCount: number;
  challengeCount: number;
  enigmaCount: number;
  gameCount: number;
  questionCount: number;
  reactionCount: number;
  reportingCount: number;
  storyCount: number;
  anthemCount: number;
  contentLibreCount: number;
  reinventStoryCount: number;
};
