import type { ComparisonStatistic } from 'src/api/statistics/compare.api';

export const COUNTRY_NAMES: Record<string, string> = {
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
  GR: 'Grèce',
  // Ajoute d'autres pays si besoin
};

export const MOCK_DATA_DTO: ComparisonStatistic[] = [
  {
    villageName: 'Village-monde France-Vietnam',
    countryCodes: ['FR', 'VN'],
    villageId: '1',
    classrooms: [
      {
        name: 'École Marie-Renard',
        countryCode: 'FR',
        classroomId: 'fr1',
        totalPublications: 15,
        phaseDetails: [
          { phaseId: 1, commentCount: 8, draftCount: 3, mascotCount: 1, videoCount: 2, enigmaCount: 1 },
          { phaseId: 2, enigmaCount: 4, reportingCount: 3, reactionCount: 10 },
          { phaseId: 3, commentCount: 4, storyCount: 1, reinventStoryCount: 1 },
        ],
      },
      {
        name: 'École Ho Chi Minh',
        countryCode: 'VN',
        classroomId: 'vn1',
        totalPublications: 12,
        phaseDetails: [
          { phaseId: 1, commentCount: 6, draftCount: 1, mascotCount: 1, videoCount: 1 },
          { phaseId: 2, enigmaCount: 3 },
        ],
      },
    ],
  },
  {
    villageName: 'Village-monde Espagne-Canada',
    countryCodes: ['ES', 'CA'],
    villageId: '9',
    classrooms: [
      {
        name: 'École de Madrid',
        countryCode: 'ES',
        classroomId: 'es1',
        totalPublications: 22,
        phaseDetails: [
          { phaseId: 1, commentCount: 10, draftCount: 5, mascotCount: 2, videoCount: 4 },
          { phaseId: 2, challengeCount: 3, gameCount: 5, questionCount: 8 },
        ],
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
    villageName: 'Village-monde France-Grèce',
    countryCodes: ['FR', 'GR'],
    villageId: '10',
    classrooms: [
      {
        name: 'École de Paris',
        countryCode: 'FR',
        classroomId: 'fr2',
        totalPublications: 25,
        phaseDetails: [
          { phaseId: 1, mascotCount: 3, videoCount: 5, enigmaCount: 5, commentCount: 12 },
          { phaseId: 2, reportingCount: 5, reactionCount: 20 },
        ],
      },
      {
        name: "École d'Athènes",
        countryCode: 'GR',
        classroomId: 'gr1',
        totalPublications: 30,
        phaseDetails: [
          { phaseId: 1, mascotCount: 4, videoCount: 6, enigmaCount: 6 },
          { phaseId: 2, gameCount: 10, questionCount: 15 },
          { phaseId: 3, storyCount: 5, anthemCount: 1, reinventStoryCount: 3 },
        ],
      },
    ],
  },
  {
    villageName: 'Brésil - Roumanie',
    villageId: '101',
    countryCodes: ['BR', 'RO'],
    classrooms: [
      {
        name: 'Escola de São Paulo',
        countryCode: 'BR',
        classroomId: 'br1',
        totalPublications: 19,
        phaseDetails: [
          { phaseId: 1, commentCount: 9, mascotCount: 2, videoCount: 3 },
          { phaseId: 2, challengeCount: 4, enigmaCount: 4 },
        ],
      },
      {
        name: 'Școala din București',
        countryCode: 'RO',
        classroomId: 'ro1',
        totalPublications: 14,
        phaseDetails: [{ phaseId: 1, commentCount: 5, mascotCount: 1, videoCount: 2, draftCount: 4 }],
      },
    ],
  },
];
