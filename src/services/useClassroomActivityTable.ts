import { useMemo } from 'react';

import type { EntityActivityCounts, ComparisonStatistic, ComparePhaseDetail } from 'src/api/statistics/compare.api';
import { useGetCompareClassesStats } from 'src/api/statistics/statistics.get';

const calculateTotalPublications = (phaseDetails: ComparePhaseDetail[], phaseId: number): number => {
  const phase = phaseDetails.find((phase) => phase.phaseId === phaseId);
  if (!phase) return 0;

  return Object.entries(phase)
    .filter(([key]) => key.endsWith('Count'))
    .reduce((sum, [, value]) => sum + (value || 0), 0);
};

export function useClassroomActivityTable(classroomId: number, phaseId: number): EntityActivityCounts[] {
  const { data: compareData, isLoading, error } = useGetCompareClassesStats(classroomId, phaseId);

  return useMemo(() => {
    const missingPhaseId = phaseId === undefined || phaseId === null;
    const missingData = isLoading || error || !compareData;

    if (missingPhaseId || missingData) {
      return [];
    }

    // Aggregate data by classrooms
    const classroomMap = new Map<string, EntityActivityCounts>();

    compareData.forEach((village: ComparisonStatistic) => {
      village.classrooms.forEach((classroom) => {
        const classroomKey = classroom.classroomId;

        // Handle phase 0 (All phases) by aggregating all phases
        let aggregatedPhase = {
          commentCount: 0,
          draftCount: 0,
          indiceCount: 0,
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
          contentLibreCount: 0,
          reinventStoryCount: 0,
        };

        if (phaseId === 0) {
          // Aggregate all phases (1, 2, 3)
          classroom.phaseDetails.forEach((phase) => {
            if (phase.phaseId && phase.phaseId >= 1 && phase.phaseId <= 3) {
              aggregatedPhase.commentCount += phase.commentCount || 0;
              aggregatedPhase.draftCount += phase.draftCount || 0;
              aggregatedPhase.indiceCount += phase.indiceCount || 0;
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
              aggregatedPhase.contentLibreCount += phase.contentLibreCount || 0;
              aggregatedPhase.reinventStoryCount += phase.reinventStoryCount || 0;
            }
          });
        } else {
          // Use specific phase
          const phase = classroom.phaseDetails.find((p: ComparePhaseDetail) => p.phaseId === phaseId);
          if (phase) {
            aggregatedPhase = {
              commentCount: phase.commentCount || 0,
              draftCount: phase.draftCount || 0,
              indiceCount: phase.indiceCount || 0,
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
              contentLibreCount: phase.contentLibreCount || 0,
              reinventStoryCount: phase.reinventStoryCount || 0,
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
            indiceCount: 0,
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
            contentLibreCount: 0,
            reinventStoryCount: 0,
            isSelected: classroomKey === classroomId.toString(), // Mark selected classroom
          });
        }

        const classroomRow = classroomMap.get(classroomKey);
        if (classroomRow) {
          const classroomTotal =
            phaseId === 0
              ? calculateTotalPublications(classroom.phaseDetails, 1) +
                calculateTotalPublications(classroom.phaseDetails, 2) +
                calculateTotalPublications(classroom.phaseDetails, 3)
              : calculateTotalPublications(classroom.phaseDetails, phaseId);

          classroomRow.totalPublications += classroomTotal;
          classroomRow.commentCount += aggregatedPhase.commentCount;
          classroomRow.draftCount += aggregatedPhase.draftCount;
          classroomRow.indiceCount += aggregatedPhase.indiceCount;
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
          classroomRow.contentLibreCount += aggregatedPhase.contentLibreCount;
          classroomRow.reinventStoryCount += aggregatedPhase.reinventStoryCount;
        }
      });
    });

    const rows = Array.from(classroomMap.values());

    if (rows.length === 0) return [];

    const totalRow: EntityActivityCounts = {
      id: 'total',
      name: 'Total',
      totalPublications: sumActivityCounts(rows, 'totalPublications'),
      commentCount: sumActivityCounts(rows, 'commentCount'),
      draftCount: sumActivityCounts(rows, 'draftCount'),
      indiceCount: sumActivityCounts(rows, 'indiceCount'),
      mascotCount: sumActivityCounts(rows, 'mascotCount'),
      videoCount: sumActivityCounts(rows, 'videoCount'),
      challengeCount: sumActivityCounts(rows, 'challengeCount'),
      enigmaCount: sumActivityCounts(rows, 'enigmaCount'),
      gameCount: sumActivityCounts(rows, 'gameCount'),
      questionCount: sumActivityCounts(rows, 'questionCount'),
      reactionCount: sumActivityCounts(rows, 'reactionCount'),
      reportingCount: sumActivityCounts(rows, 'reportingCount'),
      storyCount: sumActivityCounts(rows, 'storyCount'),
      anthemCount: sumActivityCounts(rows, 'anthemCount'),
      contentLibreCount: sumActivityCounts(rows, 'contentLibreCount'),
      reinventStoryCount: sumActivityCounts(rows, 'reinventStoryCount'),
      isSelected: false,
    };

    return [totalRow, ...rows];
  }, [classroomId, phaseId, compareData, isLoading, error]);
}

function sumActivityCounts(rows: EntityActivityCounts[], activityCountProperty: keyof EntityActivityCounts): number {
  return rows.reduce((acc, row) => acc + (row[activityCountProperty] as number), 0);
}
