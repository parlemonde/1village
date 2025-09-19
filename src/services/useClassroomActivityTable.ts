import { useMemo } from 'react';

import type { ClassroomCompareData, CleanedEntityActivityCounts } from 'src/api/statistics/compare.api';
import { useGetCompareClassroomsStats } from 'src/api/statistics/statistics.get';

export function useClassroomActivityTable(villageId: number, classroomId: number, phaseId: number): CleanedEntityActivityCounts[] {
  const { data: compareData, isLoading, error } = useGetCompareClassroomsStats(villageId, phaseId);

  return useMemo(() => {
    const missingPhaseId = phaseId === undefined || phaseId === null;
    const missingData = isLoading || error || !compareData;

    if (missingPhaseId || missingData) {
      return [];
    }

    const classroomsPhaseActivityCounts = compareData.map((classroom: ClassroomCompareData) => {
      // Handle phase 0 (All phases) by aggregating all phases
      const phase = classroom.phaseDetails;

      const aggregatedPhase = {
        id: classroom.id.toString(),
        name: classroom.name,
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
        isSelected: classroom.id === classroomId,
      };

      return aggregatedPhase;
    });

    const totalRow: CleanedEntityActivityCounts = {
      id: 'total',
      name: 'Total',
      commentCount: sumActivityCounts(classroomsPhaseActivityCounts, 'commentCount'),
      draftCount: sumActivityCounts(classroomsPhaseActivityCounts, 'draftCount'),
      indiceCount: sumActivityCounts(classroomsPhaseActivityCounts, 'indiceCount'),
      mascotCount: sumActivityCounts(classroomsPhaseActivityCounts, 'mascotCount'),
      videoCount: sumActivityCounts(classroomsPhaseActivityCounts, 'videoCount'),
      challengeCount: sumActivityCounts(classroomsPhaseActivityCounts, 'challengeCount'),
      enigmaCount: sumActivityCounts(classroomsPhaseActivityCounts, 'enigmaCount'),
      gameCount: sumActivityCounts(classroomsPhaseActivityCounts, 'gameCount'),
      questionCount: sumActivityCounts(classroomsPhaseActivityCounts, 'questionCount'),
      reactionCount: sumActivityCounts(classroomsPhaseActivityCounts, 'reactionCount'),
      reportingCount: sumActivityCounts(classroomsPhaseActivityCounts, 'reportingCount'),
      storyCount: sumActivityCounts(classroomsPhaseActivityCounts, 'storyCount'),
      anthemCount: sumActivityCounts(classroomsPhaseActivityCounts, 'anthemCount'),
      contentLibreCount: sumActivityCounts(classroomsPhaseActivityCounts, 'contentLibreCount'),
      reinventStoryCount: sumActivityCounts(classroomsPhaseActivityCounts, 'reinventStoryCount'),
      isSelected: false,
    };

    return [totalRow, ...classroomsPhaseActivityCounts];
  }, [classroomId, phaseId, compareData, isLoading, error]);
}

function sumActivityCounts(rows: CleanedEntityActivityCounts[], activityCountProperty: keyof CleanedEntityActivityCounts): number {
  return rows.reduce((acc, row) => acc + (row[activityCountProperty] as number), 0);
}
