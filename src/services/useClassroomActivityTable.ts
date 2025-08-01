import { useMemo, type ReactNode } from 'react';

import { type ComparisonStatistic, type PhaseDetail } from 'src/api/statistics/compare.api';
import { useGetCompareClassesStats } from 'src/api/statistics/statistics.get';

const calculateTotalPublications = (phaseDetails: PhaseDetail[], phaseId: number) => {
  const phase = phaseDetails.find((p) => p.phaseId === phaseId);
  if (!phase) return 0;
  return (
    (phase.mascotCount || 0) +
    (phase.videoCount || 0) +
    (phase.challengeCount || 0) +
    (phase.enigmaCount || 0) +
    (phase.gameCount || 0) +
    (phase.questionCount || 0) +
    (phase.reportingCount || 0) +
    (phase.storyCount || 0) +
    (phase.anthemCount || 0) +
    (phase.reinventStoryCount || 0) +
    (phase.contentLibreCount || 0)
  );
};

interface ClassroomRow {
  id: string;
  name: string;
  totalPublications: number;
  commentCount: number;
  draftCount: number;
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
  reinventStoryCount: number;
  contentLibreCount: number;
  isSelected: boolean;
  [key: string]: string | number | boolean | ReactNode;
}

export function useClassroomActivityTable(classroomId: number, phaseId: number) {
  const { data: compareData, isLoading, error } = useGetCompareClassesStats(classroomId, phaseId);

  return useMemo(() => {
    if (isLoading || error || !compareData) {
      return [];
    }

    if (phaseId === undefined || phaseId === null) {
      return [];
    }

    // Aggregate data by classrooms
    const classroomMap = new Map<string, ClassroomRow>();

    compareData.forEach((village: ComparisonStatistic) => {
      village.classrooms.forEach((classroom) => {
        const classroomKey = classroom.classroomId;

        // Handle phase 0 (All phases) by aggregating all phases
        let aggregatedPhase = {
          commentCount: 0,
          draftCount: 0,
          mascotCount: 0,
          videoCount: 0,
          challengeCount: 0,
          enigmaCount: 0,
          gameCount: 0,
          questionCount: 0,
          reactionCount: 0,
          reportingCount: 0,
          storyCount: 0,
          anthemCount: 0,
          reinventStoryCount: 0,
          contentLibreCount: 0,
        };

        if (phaseId === 0) {
          // Aggregate all phases (1, 2, 3)
          classroom.phaseDetails.forEach((phase) => {
            if (phase.phaseId && phase.phaseId >= 1 && phase.phaseId <= 3) {
              aggregatedPhase.commentCount += phase.commentCount || 0;
              aggregatedPhase.draftCount += phase.draftCount || 0;
              aggregatedPhase.mascotCount += phase.mascotCount || 0;
              aggregatedPhase.videoCount += phase.videoCount || 0;
              aggregatedPhase.challengeCount += phase.challengeCount || 0;
              aggregatedPhase.enigmaCount += phase.enigmaCount || 0;
              aggregatedPhase.gameCount += phase.gameCount || 0;
              aggregatedPhase.questionCount += phase.questionCount || 0;
              aggregatedPhase.reactionCount += phase.reactionCount || 0;
              aggregatedPhase.reportingCount += phase.reportingCount || 0;
              aggregatedPhase.storyCount += phase.storyCount || 0;
              aggregatedPhase.anthemCount += phase.anthemCount || 0;
              aggregatedPhase.reinventStoryCount += phase.reinventStoryCount || 0;
              aggregatedPhase.contentLibreCount += phase.contentLibreCount || 0;
            }
          });
        } else {
          // Use specific phase
          const phase = classroom.phaseDetails.find((p: PhaseDetail) => p.phaseId === phaseId);
          if (phase) {
            aggregatedPhase = {
              commentCount: phase.commentCount || 0,
              draftCount: phase.draftCount || 0,
              mascotCount: phase.mascotCount || 0,
              videoCount: phase.videoCount || 0,
              challengeCount: phase.challengeCount || 0,
              enigmaCount: phase.enigmaCount || 0,
              gameCount: phase.gameCount || 0,
              questionCount: phase.questionCount || 0,
              reactionCount: phase.reactionCount || 0,
              reportingCount: phase.reportingCount || 0,
              storyCount: phase.storyCount || 0,
              anthemCount: phase.anthemCount || 0,
              reinventStoryCount: phase.reinventStoryCount || 0,
              contentLibreCount: phase.contentLibreCount || 0,
            };
          }
        }

        if (!classroomMap.has(classroomKey)) {
          classroomMap.set(classroomKey, {
            id: classroomKey,
            name: classroom.classroomName || `Classe ${classroomKey}`,
            totalPublications: 0,
            commentCount: 0,
            draftCount: 0,
            mascotCount: 0,
            videoCount: 0,
            challengeCount: 0,
            enigmaCount: 0,
            gameCount: 0,
            questionCount: 0,
            reactionCount: 0,
            reportingCount: 0,
            storyCount: 0,
            anthemCount: 0,
            reinventStoryCount: 0,
            contentLibreCount: 0,
            isSelected: classroomKey === classroomId.toString(), // Mark selected classroom
          });
        }

        const classroomRow = classroomMap.get(classroomKey)!;
        const classroomTotal =
          phaseId === 0
            ? calculateTotalPublications(classroom.phaseDetails, 1) +
              calculateTotalPublications(classroom.phaseDetails, 2) +
              calculateTotalPublications(classroom.phaseDetails, 3)
            : calculateTotalPublications(classroom.phaseDetails, phaseId);

        classroomRow.totalPublications += classroomTotal;
        classroomRow.commentCount += aggregatedPhase.commentCount;
        classroomRow.draftCount += aggregatedPhase.draftCount;
        classroomRow.mascotCount += aggregatedPhase.mascotCount;
        classroomRow.videoCount += aggregatedPhase.videoCount;
        classroomRow.challengeCount += aggregatedPhase.challengeCount;
        classroomRow.enigmaCount += aggregatedPhase.enigmaCount;
        classroomRow.gameCount += aggregatedPhase.gameCount;
        classroomRow.questionCount += aggregatedPhase.questionCount;
        classroomRow.reactionCount += aggregatedPhase.reactionCount;
        classroomRow.reportingCount += aggregatedPhase.reportingCount;
        classroomRow.storyCount += aggregatedPhase.storyCount;
        classroomRow.anthemCount += aggregatedPhase.anthemCount;
        classroomRow.reinventStoryCount += aggregatedPhase.reinventStoryCount;
        classroomRow.contentLibreCount += aggregatedPhase.contentLibreCount;
      });
    });

    const rows = Array.from(classroomMap.values());

    if (rows.length === 0) return [];

    const totalRow: ClassroomRow = {
      id: 'total',
      name: 'Total',
      totalPublications: rows.reduce((acc, row) => acc + row.totalPublications, 0),
      commentCount: rows.reduce((acc, row) => acc + row.commentCount, 0),
      draftCount: rows.reduce((acc, row) => acc + row.draftCount, 0),
      mascotCount: rows.reduce((acc, row) => acc + row.mascotCount, 0),
      videoCount: rows.reduce((acc, row) => acc + row.videoCount, 0),
      challengeCount: rows.reduce((acc, row) => acc + row.challengeCount, 0),
      enigmaCount: rows.reduce((acc, row) => acc + row.enigmaCount, 0),
      gameCount: rows.reduce((acc, row) => acc + row.gameCount, 0),
      questionCount: rows.reduce((acc, row) => acc + row.questionCount, 0),
      reactionCount: rows.reduce((acc, row) => acc + row.reactionCount, 0),
      reportingCount: rows.reduce((acc, row) => acc + row.reportingCount, 0),
      storyCount: rows.reduce((acc, row) => acc + row.storyCount, 0),
      anthemCount: rows.reduce((acc, row) => acc + row.anthemCount, 0),
      reinventStoryCount: rows.reduce((acc, row) => acc + row.reinventStoryCount, 0),
      contentLibreCount: rows.reduce((acc, row) => acc + row.contentLibreCount, 0),
      isSelected: false,
    };

    return [...rows, totalRow];
  }, [classroomId, phaseId, compareData, isLoading, error]);
}
