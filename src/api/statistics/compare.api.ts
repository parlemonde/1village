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
    phaseDetails: PhaseDetail[];
  }[];
};

export type PhaseDetail = {
  phaseId: number;
  commentCount?: number;
  draftCount?: number;
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
};
