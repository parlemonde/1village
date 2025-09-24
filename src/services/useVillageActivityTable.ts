import { useMemo } from 'react';

import type { CleanedEntityActivityCounts, CountryCompareData } from 'src/api/statistics/compare.api';
import { useGetCompareVillagesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';

export function useVillageActivityTable(villageId: number, phaseId: number) {
  const { data: compareData, isLoading, error } = useGetCompareVillagesStats(villageId, phaseId);
  const { countries } = useCountries();

  return useMemo(() => {
    const missingPhaseId = !phaseId;
    const missingData = isLoading || error || !compareData;

    if (missingPhaseId || missingData) {
      return [];
    }

    // Create a map of country codes to names
    const countryNameMap = new Map(countries.map((country) => [country.isoCode, country.name]));

    const villageCountriesPhaseActivityCounts = compareData.map((country: CountryCompareData) => {
      // Handle phase 0 (All phases) by aggregating all phases

      const phase = country.phaseDetails;

      const aggregatedPhase = {
        id: country.countryCode,
        name: countryNameMap.get(country.countryCode) || country.countryCode,
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

      return aggregatedPhase;
    });

    const totalRow: CleanedEntityActivityCounts = {
      id: 'total',
      name: 'Total',
      commentCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'commentCount'),
      draftCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'draftCount'),
      indiceCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'indiceCount'),
      mascotCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'mascotCount'),
      videoCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'videoCount'),
      challengeCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'challengeCount'),
      enigmaCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'enigmaCount'),
      gameCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'gameCount'),
      questionCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'questionCount'),
      reactionCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'reactionCount'),
      reportingCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'reportingCount'),
      storyCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'storyCount'),
      anthemCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'anthemCount'),
      contentLibreCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'contentLibreCount'),
      reinventStoryCount: sumActivityCounts(villageCountriesPhaseActivityCounts, 'reinventStoryCount'),
      isSelected: false,
    };

    return [totalRow, ...villageCountriesPhaseActivityCounts];
  }, [phaseId, compareData, isLoading, error, countries]);
}

function sumActivityCounts(rows: CleanedEntityActivityCounts[], activityCountProperty: keyof CleanedEntityActivityCounts): number {
  return rows.reduce((acc, row) => acc + (row[activityCountProperty] as number), 0);
}
