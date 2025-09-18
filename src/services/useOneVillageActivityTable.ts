import { useMemo } from 'react';

import type { CleanedEntityActivityCounts, VillageCompareData } from '../api/statistics/compare.api';
import { useGetCompareGlobalStats } from '../api/statistics/statistics.get';

export function useOneVillageActivityTable(phaseId: number): CleanedEntityActivityCounts[] {
  const { data: compareData, isLoading, error } = useGetCompareGlobalStats(phaseId);

  return useMemo(() => {
    const missingPhaseId = !phaseId;
    const missingData = isLoading || error || !compareData;

    if (missingPhaseId || missingData) {
      return [];
    }

    const villagesPhaseActivityCounts = compareData.map((village: VillageCompareData) => {
      // Handle phase 0 (All phases) by aggregating all phases
      const phase = village.phaseDetails;

      const aggregatedPhase = {
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
        isSelected: false,
      };

      return { ...village, ...aggregatedPhase };
    });

    const totalRow: CleanedEntityActivityCounts = {
      id: 'total',
      name: 'Total',
      commentCount: sumActivityCounts(villagesPhaseActivityCounts, 'commentCount'),
      draftCount: sumActivityCounts(villagesPhaseActivityCounts, 'draftCount'),
      indiceCount: sumActivityCounts(villagesPhaseActivityCounts, 'indiceCount'),
      mascotCount: sumActivityCounts(villagesPhaseActivityCounts, 'mascotCount'),
      videoCount: sumActivityCounts(villagesPhaseActivityCounts, 'videoCount'),
      challengeCount: sumActivityCounts(villagesPhaseActivityCounts, 'challengeCount'),
      enigmaCount: sumActivityCounts(villagesPhaseActivityCounts, 'enigmaCount'),
      gameCount: sumActivityCounts(villagesPhaseActivityCounts, 'gameCount'),
      questionCount: sumActivityCounts(villagesPhaseActivityCounts, 'questionCount'),
      reactionCount: sumActivityCounts(villagesPhaseActivityCounts, 'reactionCount'),
      reportingCount: sumActivityCounts(villagesPhaseActivityCounts, 'reportingCount'),
      storyCount: sumActivityCounts(villagesPhaseActivityCounts, 'storyCount'),
      anthemCount: sumActivityCounts(villagesPhaseActivityCounts, 'anthemCount'),
      contentLibreCount: sumActivityCounts(villagesPhaseActivityCounts, 'contentLibreCount'),
      reinventStoryCount: sumActivityCounts(villagesPhaseActivityCounts, 'reinventStoryCount'),
      isSelected: false,
    };

    return [totalRow, ...villagesPhaseActivityCounts];
  }, [phaseId, compareData, isLoading, error]);
}

function sumActivityCounts(rows: CleanedEntityActivityCounts[], activityCountProperty: keyof CleanedEntityActivityCounts): number {
  return rows.reduce((acc, row) => acc + (row[activityCountProperty] as number), 0);
}
