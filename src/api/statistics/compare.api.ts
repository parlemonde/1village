import type { ReactNode } from 'react';

import type { PhaseDetails } from '../../../types/statistics.type';

export type ComparisonStatistic = {
  villageName: string;
  villageId: string;
  countryCodes: string[];
  classrooms: {
    name: string;
    classroomName: string;
    countryCode: string;
    classroomId: string;
    totalPublications: number;
    phaseDetails: ComparePhaseDetail[];
  }[];
};

export type ComparePhaseDetail = Omit<PhaseDetails, 'commentCount' | 'draftCount'> & {
  commentCount?: number;
  draftCount?: number;
};

export type PhaseTableRow = Omit<ComparePhaseDetail, 'phaseId'> & {
  id: string | number;
  name: string;
  totalPublications?: number;
  isSelected?: boolean;
};

export type EntityActivityCounts = Omit<PhaseData, 'phaseId'> & {
  id: string;
  name: string;
  totalPublications: number;
  isSelected: boolean;
  [key: string]: string | number | boolean | ReactNode;
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
