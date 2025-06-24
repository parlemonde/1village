import { useMemo } from 'react';

// TypeScript types pour coller au format backend fourni
export type PhaseDetail = {
  phaseId: number;
  commentCount?: number;
  draftCount?: number;
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
  reinventStoryCount?: number;
};

export type ClassroomActivity = {
  name: string;
  countryCode: string;
  classroomId: string;
  totalPublications: number;
  phaseDetails: PhaseDetail[];
};

export type VillageActivity = {
  villageName: string;
  villageId: string;
  countryCodes: string[];
  classrooms: ClassroomActivity[];
};

// TODO: Fake data (à remplacer par un appel API plus tard)
const MOCK_DATA: VillageActivity[] = [
  {
    villageName: 'France - Vietnam',
    villageId: '123',
    countryCodes: ['FR', 'VN'],
    classrooms: [
      {
        name: 'École Marie-Renard',
        countryCode: 'FR',
        classroomId: '123',
        totalPublications: 5,
        phaseDetails: [
          {
            commentCount: 8,
            draftCount: 3,
            mascotCount: 1,
            phaseId: 1,
            videoCount: 0,
          },
          {
            challengeCount: 0,
            commentCount: 0,
            draftCount: 0,
            enigmaCount: 4,
            gameCount: 0,
            phaseId: 2,
            questionCount: 0,
            reactionCount: 0,
            reportingCount: 0,
            storyCount: 0,
            videoCount: 0,
          },
          {
            anthemCount: 0,
            commentCount: 4,
            draftCount: 0,
            phaseId: 3,
            reinventStoryCount: 0,
            videoCount: 0,
          },
        ],
      },
      {
        name: 'École Marie-Renard',
        countryCode: 'FR',
        classroomId: '123',
        totalPublications: 5,
        phaseDetails: [
          {
            commentCount: 6,
            draftCount: 0,
            mascotCount: 0,
            phaseId: 1,
            videoCount: 0,
          },
        ],
      },
    ],
  },
  {
    villageName: 'France - Espagne',
    villageId: '123',
    countryCodes: ['FR', 'ES'],
    classrooms: [
      {
        name: 'École Marie-Renard',
        countryCode: 'FR',
        classroomId: '123',
        totalPublications: 5,
        phaseDetails: [
          {
            commentCount: 9,
            draftCount: 0,
            mascotCount: 0,
            phaseId: 1,
            videoCount: 0,
          },
        ],
      },
    ],
  },
];

const COUNTRY_NAMES: Record<string, string> = {
  FR: 'France',
  VN: 'Vietnam',
  ES: 'Espagne',
  CA: 'Canada',
  AR: 'Argentine',
  BR: 'Brésil',
  EC: 'Équateur',
  IT: 'Italie',
  JP: 'Japon',
  LB: 'Liban',
  MA: 'Maroc',
  RO: 'Roumanie',
  GB: 'Royaume-Uni',
  RS: 'Serbie',
  TN: 'Tunisie',
  TR: 'Turquie',
  // Ajoute d'autres pays si besoin
};

export type CountryActivityMode = 'country' | 'class';

export function useCountryActivityTable(countryCode: string, phaseId: number, mode: CountryActivityMode = 'class') {
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
      for (const village of MOCK_DATA) {
        for (const cc of village.countryCodes) {
          const classes = village.classrooms.filter((c) => c.countryCode === cc);
          // Pour chaque classe, on cherche la phase demandée
          let totalPublications = 0;
          let commentCount = 0;
          let draftCount = 0;
          let mascotCount = 0;
          let videoCount = 0;
          let challengeCount = 0;
          let enigmaCount = 0;
          let gameCount = 0;
          let questionCount = 0;
          let reactionCount = 0;
          let reportingCount = 0;
          let storyCount = 0;
          let anthemCount = 0;
          let reinventStoryCount = 0;
          for (const c of classes) {
            const phase = c.phaseDetails.find((p) => p.phaseId === phaseId);
            totalPublications += c.totalPublications || 0;
            if (phase) {
              commentCount += phase.commentCount || 0;
              draftCount += phase.draftCount || 0;
              mascotCount += phase.mascotCount || 0;
              videoCount += phase.videoCount || 0;
              challengeCount += phase.challengeCount || 0;
              enigmaCount += phase.enigmaCount || 0;
              gameCount += phase.gameCount || 0;
              questionCount += phase.questionCount || 0;
              reactionCount += phase.reactionCount || 0;
              reportingCount += phase.reportingCount || 0;
              storyCount += phase.storyCount || 0;
              anthemCount += phase.anthemCount || 0;
              reinventStoryCount += phase.reinventStoryCount || 0;
            }
          }
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
          countryStats[cc].commentCount += commentCount;
          countryStats[cc].draftCount += draftCount;
          countryStats[cc].mascotCount += mascotCount;
          countryStats[cc].videoCount += videoCount;
          countryStats[cc].challengeCount += challengeCount;
          countryStats[cc].enigmaCount += enigmaCount;
          countryStats[cc].gameCount += gameCount;
          countryStats[cc].questionCount += questionCount;
          countryStats[cc].reactionCount += reactionCount;
          countryStats[cc].reportingCount += reportingCount;
          countryStats[cc].storyCount += storyCount;
          countryStats[cc].anthemCount += anthemCount;
          countryStats[cc].reinventStoryCount += reinventStoryCount;
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
      return rows;
    } else {
      // mode 'class' (comportement actuel)
      if (!countryCode) return [];
      const villages = MOCK_DATA.filter((v) => v.countryCodes.includes(countryCode));
      const classrooms = villages.flatMap((v) => v.classrooms.filter((c) => c.countryCode === countryCode));
      return classrooms.map((c) => {
        const phase = c.phaseDetails.find((p) => p.phaseId === phaseId);
        return {
          ...c,
          phaseDetail: phase,
        };
      });
    }
  }, [countryCode, phaseId, mode]);
}
