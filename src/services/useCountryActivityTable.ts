import { useMemo } from 'react';

import { type PhaseDetail } from 'src/api/statistics/compare.api';
import { COUNTRY_NAMES, MOCK_DATA_DTO } from 'src/services/mocks/statistics.mocks';

// TypeScript types pour coller au format backend fourni
export type ClassroomActivity = {
  name: string;
  countryCode: string;
  classroomId: string;
  totalPublications: number;
  phaseDetails: PhaseDetail[];
};

export type { PhaseDetail };

export type VillageActivity = {
  villageName: string;
  villageId: string;
  countryCodes: string[];
  classrooms: ClassroomActivity[];
};

export type CountryActivityMode = 'country' | 'class';

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
    (phase.reinventStoryCount || 0)
  );
};

export function useCountryActivityTable(countryCode: string, phaseId: number, mode: CountryActivityMode = 'class') {
  // const { data } = useGetCompareCountriesStats(countryCode, phaseId);
  const data = MOCK_DATA_DTO;

  return useMemo(() => {
    if (!phaseId) return [];
    if (mode === 'country') {
      const countryStats: Record<
        string,
        {
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
          isSelected: boolean;
        }
      > = {};

      for (const village of data) {
        for (const classroom of village.classrooms) {
          const cc = classroom.countryCode;

          const totalPublications = calculateTotalPublications(classroom.phaseDetails, phaseId);
          const phase = classroom.phaseDetails.find((p) => p.phaseId === phaseId);

          if (!countryStats[cc]) {
            countryStats[cc] = {
              id: cc,
              name: COUNTRY_NAMES[cc] || cc,
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
              isSelected: false,
            };
          }

          countryStats[cc].totalPublications += totalPublications;
          if (phase) {
            countryStats[cc].commentCount += phase.commentCount || 0;
            countryStats[cc].draftCount += phase.draftCount || 0;
            countryStats[cc].mascotCount += phase.mascotCount || 0;
            countryStats[cc].videoCount += phase.videoCount || 0;
            countryStats[cc].challengeCount += phase.challengeCount || 0;
            countryStats[cc].enigmaCount += phase.enigmaCount || 0;
            countryStats[cc].gameCount += phase.gameCount || 0;
            countryStats[cc].questionCount += phase.questionCount || 0;
            countryStats[cc].reactionCount += phase.reactionCount || 0;
            countryStats[cc].reportingCount += phase.reportingCount || 0;
            countryStats[cc].storyCount += phase.storyCount || 0;
            countryStats[cc].anthemCount += phase.anthemCount || 0;
            countryStats[cc].reinventStoryCount += phase.reinventStoryCount || 0;
          }
        }
      }
      let rows = Object.values(countryStats);
      // Ajoute le pays sélectionné si absent
      if (countryCode && !countryStats[countryCode]) {
        rows = [
          {
            id: countryCode,
            name: COUNTRY_NAMES[countryCode] || countryCode,
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
            isSelected: true,
          },
          ...rows,
        ];
      } else if (countryCode) {
        rows = rows.map((row) => (row.id === countryCode ? { ...row, isSelected: true } : row));
        // Trie pour mettre le pays sélectionné en premier
        rows = rows.sort((a, b) => (a.id === countryCode ? -1 : b.id === countryCode ? 1 : 0));
      }

      const totalRow = {
        id: 'total',
        name: 'Total',
        totalPublications: rows.reduce((acc, row) => acc + (row.totalPublications || 0), 0),
        commentCount: rows.reduce((acc, row) => acc + (row.commentCount || 0), 0),
        draftCount: rows.reduce((acc, row) => acc + (row.draftCount || 0), 0),
        mascotCount: rows.reduce((acc, row) => acc + (row.mascotCount || 0), 0),
        videoCount: rows.reduce((acc, row) => acc + (row.videoCount || 0), 0),
        challengeCount: rows.reduce((acc, row) => acc + (row.challengeCount || 0), 0),
        enigmaCount: rows.reduce((acc, row) => acc + (row.enigmaCount || 0), 0),
        gameCount: rows.reduce((acc, row) => acc + (row.gameCount || 0), 0),
        questionCount: rows.reduce((acc, row) => acc + (row.questionCount || 0), 0),
        reactionCount: rows.reduce((acc, row) => acc + (row.reactionCount || 0), 0),
        reportingCount: rows.reduce((acc, row) => acc + (row.reportingCount || 0), 0),
        storyCount: rows.reduce((acc, row) => acc + (row.storyCount || 0), 0),
        anthemCount: rows.reduce((acc, row) => acc + (row.anthemCount || 0), 0),
        reinventStoryCount: rows.reduce((acc, row) => acc + (row.reinventStoryCount || 0), 0),
        isSelected: false,
        _highlight: true,
      };

      return [totalRow, ...rows];
    } else {
      // mode 'class' (comportement actuel)
      if (!countryCode) return [];
      const villages = data.filter((v) => v.classrooms.some((c) => c.countryCode === countryCode));
      const classrooms = villages.flatMap((v) => v.classrooms.filter((c) => c.countryCode === countryCode));
      return classrooms.map((c) => {
        const phase = c.phaseDetails.find((p) => p.phaseId === phaseId);
        return {
          ...c,
          totalPublications: calculateTotalPublications(c.phaseDetails, phaseId),
          phaseDetail: phase,
        };
      });
    }
  }, [countryCode, phaseId, mode, data]);
}
