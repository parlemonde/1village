import { useMemo } from 'react';

import { type ComparisonStatistic, type PhaseDetail } from 'src/api/statistics/compare.api';
import { COUNTRY_NAMES } from 'src/services/mocks/statistics.mocks';

type CountryStats = {
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
};

const fakeResponse: ComparisonStatistic[] = [
  {
    villageName: 'Village-monde France-Vietnam',
    villageId: '1',
    countryCodes: ['FR', 'VN'],
    classrooms: [
      {
        name: 'École Marie-Renard',
        countryCode: 'FR',
        classroomId: 'c1',
        totalPublications: 10,
        phaseDetails: [
          { phaseId: 1, mascotCount: 1, videoCount: 2, enigmaCount: 3, commentCount: 5, draftCount: 2 },
          {
            phaseId: 2,
            reportingCount: 2,
            challengeCount: 1,
            enigmaCount: 1,
            gameCount: 4,
            questionCount: 5,
            reactionCount: 12,
            videoCount: 3,
            commentCount: 10,
            draftCount: 1,
          },
        ],
      },
      {
        name: 'École Ho Chi Minh',
        countryCode: 'VN',
        classroomId: 'c2',
        totalPublications: 15,
        phaseDetails: [
          { phaseId: 1, mascotCount: 2, videoCount: 3, enigmaCount: 4, commentCount: 8, draftCount: 1 },
          { phaseId: 2, enigmaCount: 3 },
        ],
      },
    ],
  },
  {
    villageName: 'Village-monde France-Grèce',
    villageId: '3',
    countryCodes: ['FR', 'GR'],
    classrooms: [
      {
        name: 'École de Paris',
        countryCode: 'FR',
        classroomId: 'fr-gr-1',
        totalPublications: 10,
        phaseDetails: [{ phaseId: 1, mascotCount: 1, videoCount: 1, enigmaCount: 2, commentCount: 4 }],
      },
      {
        name: "École d'Athènes",
        countryCode: 'GR',
        classroomId: 'fr-gr-2',
        totalPublications: 8,
        phaseDetails: [{ phaseId: 1, mascotCount: 1, videoCount: 1, enigmaCount: 1, commentCount: 3 }],
      },
    ],
  },
  {
    villageName: 'Village-monde France-Tunisie',
    villageId: '4',
    countryCodes: ['FR', 'TN'],
    classrooms: [
      {
        name: 'École de Lyon',
        countryCode: 'FR',
        classroomId: 'fr-tn-1',
        totalPublications: 12,
        phaseDetails: [{ phaseId: 1, mascotCount: 2, videoCount: 2 }],
      },
      {
        name: 'École de Tunis',
        countryCode: 'TN',
        classroomId: 'fr-tn-2',
        totalPublications: 9,
        phaseDetails: [{ phaseId: 1, videoCount: 3, commentCount: 5 }],
      },
    ],
  },
  {
    villageName: 'Village-monde France-Roumanie',
    villageId: '5',
    countryCodes: ['FR', 'RO'],
    classrooms: [
      {
        name: 'École de Marseille',
        countryCode: 'FR',
        classroomId: 'fr-ro-1',
        totalPublications: 5,
        phaseDetails: [{ phaseId: 1, enigmaCount: 2, draftCount: 1 }],
      },
      {
        name: 'Școala din București',
        countryCode: 'RO',
        classroomId: 'fr-ro-2',
        totalPublications: 7,
        phaseDetails: [{ phaseId: 1, commentCount: 10, mascotCount: 1 }],
      },
    ],
  },
  {
    villageName: 'Village-monde Espagne-Canada',
    villageId: '6',
    countryCodes: ['ES', 'CA'],
    classrooms: [
      {
        name: 'École de Madrid',
        countryCode: 'ES',
        classroomId: 'c4',
        totalPublications: 12,
        phaseDetails: [{ phaseId: 1, mascotCount: 1, videoCount: 4, enigmaCount: 5, commentCount: 8, draftCount: 0 }],
      },
      {
        name: 'École de Montréal',
        countryCode: 'CA',
        classroomId: 'ca1',
        totalPublications: 18,
        phaseDetails: [
          { phaseId: 1, commentCount: 7, draftCount: 3, mascotCount: 1, videoCount: 2 },
          { phaseId: 3, anthemCount: 1, storyCount: 2 },
        ],
      },
    ],
  },
  {
    villageName: 'Village-monde France-Serbie',
    villageId: '8',
    countryCodes: ['FR', 'RS'],
    classrooms: [
      {
        name: 'École de Nice',
        countryCode: 'FR',
        classroomId: 'fr-rs-1',
        totalPublications: 11,
        phaseDetails: [{ phaseId: 2, reportingCount: 3, reactionCount: 5 }],
      },
      {
        name: 'Škola u Beogradu',
        countryCode: 'RS',
        classroomId: 'fr-rs-2',
        totalPublications: 13,
        phaseDetails: [{ phaseId: 2, challengeCount: 4, gameCount: 2 }],
      },
    ],
  },
  {
    villageName: 'Village-monde France-Italie',
    villageId: '9',
    countryCodes: ['FR', 'IT'],
    classrooms: [
      {
        name: 'École de Bordeaux',
        countryCode: 'FR',
        classroomId: 'fr-it-1',
        totalPublications: 14,
        phaseDetails: [{ phaseId: 3, storyCount: 2, reinventStoryCount: 1 }],
      },
      {
        name: 'Scuola di Roma',
        countryCode: 'IT',
        classroomId: 'fr-it-2',
        totalPublications: 16,
        phaseDetails: [{ phaseId: 3, reinventStoryCount: 1, anthemCount: 1 }],
      },
    ],
  },
];

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

export function useVillageActivityTable(villageId: number, phaseId: number) {
  // const { data } = useGetCompareVillagesStats(villageId, phaseId);
  const data = fakeResponse;

  return useMemo(() => {
    if (!villageId || !data) {
      return [];
    }

    const selectedVillageData = data.find((v) => v.villageId === villageId.toString());

    if (!selectedVillageData) {
      return []; // Village not found
    }

    const countryStats: Record<string, CountryStats> = {};
    for (const code of selectedVillageData.countryCodes) {
      countryStats[code] = {
        id: code,
        name: COUNTRY_NAMES[code] || code,
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

    for (const classroom of selectedVillageData.classrooms) {
      const cc = classroom.countryCode;
      if (!cc || !countryStats[cc]) continue;

      const totalPublications = calculateTotalPublications(classroom.phaseDetails, phaseId);
      const phase = classroom.phaseDetails.find((p: PhaseDetail) => p.phaseId === phaseId);

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

    const rows = Object.values(countryStats);

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
  }, [data, phaseId, villageId]);
}
