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
