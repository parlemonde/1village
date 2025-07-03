import { useMemo } from 'react';

import type { ComparePhaseDetail, EntityActivityCounts, ComparisonStatistic } from 'src/api/statistics/compare.api';
import { useGetCompareCountriesStats } from 'src/api/statistics/statistics.get';
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

export function useCountryActivityTable(countryCode: string, phaseId: number) {
  const { data: compareData, isLoading, error } = useGetCompareCountriesStats(countryCode, phaseId);
  const { countries } = useCountries();

  return useMemo(() => {
    if (isLoading || error || !compareData) {
      return [];
    }

    if (phaseId === undefined || phaseId === null) {
      return [];
    }

    const countryNameMap = new Map(countries.map((country) => [country.isoCode, country.name]));
    const countryMap = new Map<string, EntityActivityCounts>();
    const dataArray = Array.isArray(compareData) ? compareData : [compareData];

    dataArray.forEach((village: ComparisonStatistic) => {
      if (!village || !Array.isArray(village.classrooms)) return;

      village.classrooms.forEach((classroom) => {
        const countryKey = classroom.countryCode;

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
            isSelected: countryKey === countryCode,
          });
        }

        const EntityActivityCountsRow = countryMap.get(countryKey);
        if (EntityActivityCountsRow) {
          const classroomTotal =
            phaseId === 0
              ? calculateTotalPublications(classroom.phaseDetails, 1) +
                calculateTotalPublications(classroom.phaseDetails, 2) +
                calculateTotalPublications(classroom.phaseDetails, 3)
              : calculateTotalPublications(classroom.phaseDetails, phaseId);

          EntityActivityCountsRow.totalPublications += classroomTotal;
          EntityActivityCountsRow.commentCount += aggregatedPhase.commentCount;
          EntityActivityCountsRow.draftCount += aggregatedPhase.draftCount;
          EntityActivityCountsRow.indiceCount += aggregatedPhase.indiceCount;
          EntityActivityCountsRow.mascotCount += aggregatedPhase.mascotCount;
          EntityActivityCountsRow.videoCount += aggregatedPhase.videoCount;
          EntityActivityCountsRow.challengeCount += aggregatedPhase.challengeCount;
          EntityActivityCountsRow.enigmaCount += aggregatedPhase.enigmaCount;
          EntityActivityCountsRow.gameCount += aggregatedPhase.gameCount;
          EntityActivityCountsRow.questionCount += aggregatedPhase.questionCount;
          EntityActivityCountsRow.reactionCount += aggregatedPhase.reactionCount;
          EntityActivityCountsRow.reportingCount += aggregatedPhase.reportingCount;
          EntityActivityCountsRow.storyCount += aggregatedPhase.storyCount;
          EntityActivityCountsRow.anthemCount += aggregatedPhase.anthemCount;
          EntityActivityCountsRow.contentLibreCount += aggregatedPhase.contentLibreCount;
          EntityActivityCountsRow.reinventStoryCount += aggregatedPhase.reinventStoryCount;
        }
      });
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
  }, [countryCode, phaseId, compareData, isLoading, error, countries]);
}

function sumActivityCounts(rows: EntityActivityCounts[], activityCountProperty: keyof EntityActivityCounts): number {
  return rows.reduce((acc, row) => acc + (row[activityCountProperty] as number), 0);
}
