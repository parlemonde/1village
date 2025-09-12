import { useMemo } from 'react';

import type { ComparePhaseDetail, EntityActivityCounts } from 'src/api/statistics/compare.api';
import { useGetCompareVillagesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';

const calculateTotalPublications = (phaseDetails: ComparePhaseDetail[], phaseId: number) => {
  const phase = phaseDetails.find((p) => p.phaseId === phaseId);
  if (!phase) return 0;
  return (
    (phase.indiceCount || 0) +
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

export function useVillageActivityTable(villageId: number, phaseId: number) {
  const { data: compareData, isLoading, error } = useGetCompareVillagesStats(villageId, phaseId);
  const { countries } = useCountries();

  return useMemo(() => {
    if (isLoading || error || !compareData) {
      return [];
    }

    if (phaseId === undefined || phaseId === null) {
      return [];
    }

    // Create a map of country codes to names
    const countryNameMap = new Map(countries.map((country) => [country.isoCode, country.name]));

    // Get country codes from village data
    const countryCodes = Array.from(
      new Set(compareData.flatMap((village) => village.classrooms.map((classroom) => classroom.countryCode).filter((code) => code))),
    );

    // Aggregate data by countries instead of villages
    const countryMap = new Map<string, EntityActivityCounts>();

    // Process data
    compareData.forEach((village) => {
      village.classrooms.forEach((classroom) => {
        const countryKey = classroom.countryCode;

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

        if (!countryMap.has(countryKey)) {
          countryMap.set(countryKey, {
            id: countryKey,
            name: countryNameMap.get(countryKey) || countryKey,
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
            isSelected: false,
          });
        }

        const countryRow = countryMap.get(countryKey);
        if (countryRow) {
          const classroomTotal =
            phaseId === 0
              ? calculateTotalPublications(classroom.phaseDetails, 1) +
                calculateTotalPublications(classroom.phaseDetails, 2) +
                calculateTotalPublications(classroom.phaseDetails, 3)
              : calculateTotalPublications(classroom.phaseDetails, phaseId);

          countryRow.totalPublications += classroomTotal;
          countryRow.commentCount += aggregatedPhase.commentCount;
          countryRow.draftCount += aggregatedPhase.draftCount;
          countryRow.indiceCount += aggregatedPhase.indiceCount;
          countryRow.mascotCount += aggregatedPhase.mascotCount;
          countryRow.videoCount += aggregatedPhase.videoCount;
          countryRow.challengeCount += aggregatedPhase.challengeCount;
          countryRow.enigmaCount += aggregatedPhase.enigmaCount;
          countryRow.gameCount += aggregatedPhase.gameCount;
          countryRow.questionCount += aggregatedPhase.questionCount;
          countryRow.reactionCount += aggregatedPhase.reactionCount;
          countryRow.reportingCount += aggregatedPhase.reportingCount;
          countryRow.storyCount += aggregatedPhase.storyCount;
          countryRow.anthemCount += aggregatedPhase.anthemCount;
          countryRow.contentLibreCount += aggregatedPhase.contentLibreCount;
          countryRow.reinventStoryCount += aggregatedPhase.reinventStoryCount;
        }
      });
    });

    // Ajoute une ligne vide pour chaque pays manquant
    countryCodes.forEach((code: string) => {
      if (!countryMap.has(code)) {
        countryMap.set(code, {
          id: code,
          name: countryNameMap.get(code) || code,
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
          isSelected: false,
        });
      }
    });

    const rows = Array.from(countryMap.values());

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
  }, [phaseId, compareData, isLoading, error, countries]);
}

function sumActivityCounts(rows: EntityActivityCounts[], activityCountProperty: keyof EntityActivityCounts): number {
  return rows.reduce((acc, row) => acc + (row[activityCountProperty] as number), 0);
}
