import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

export const mockClassroomsStats: ClassroomsStats[] = [
  {
    classroomId: 1,
    classroomCountryCode: 'FR',
    villageId: 1,
    villageName: 'Village A',
    commentsCount: 10,
    videosCount: 2,
    userFirstName: 5,
    userLastName: 5,
    activities: [
      { count: 10, type: 1, phase: 1 },
      { count: 15, type: 2, phase: 1 },
      { count: 5, type: 3, phase: 2 },
      { count: 7, type: 4, phase: 2 },
    ],
  },
  {
    classroomId: 2,
    classroomCountryCode: 'CA',
    villageId: 2,
    villageName: 'Village B',
    commentsCount: 15,
    videosCount: 3,
    userFirstName: 3,
    userLastName: 4,
    activities: [
      { count: 22, type: 1, phase: 1 },
      { count: 15, type: 2, phase: 1 },
      { count: 10, type: 3, phase: 2 },
      { count: 2, type: 4, phase: 3 },
    ],
  },
  {
    classroomId: 3,
    classroomCountryCode: 'FR',
    villageId: 456,
    villageName: 'Village C',
    commentsCount: 40,
    videosCount: 2,
    userFirstName: 5,
    userLastName: 5,
    activities: [
      { count: 5, type: 1, phase: 1 },
      { count: 25, type: 2, phase: 2 },
      { count: 3, type: 3, phase: 2 },
      { count: 8, type: 4, phase: 3 },
    ],
  },
  {
    classroomId: 5,
    classroomCountryCode: 'PT',
    villageId: 1,
    villageName: 'Village D',
    commentsCount: 20,
    videosCount: 2,
    userFirstName: 5,
    userLastName: 5,
    activities: [
      { count: 9, type: 1, phase: 1 },
      { count: 15, type: 2, phase: 1 },
      { count: 15, type: 3, phase: 3 },
      { count: 4, type: 4, phase: 3 },
    ],
  },
];

export const mockConnectionsStats: SessionsStats[] = [
  {
    minDuration: 30,
    maxDuration: 120,
    medianDuration: 60,
    averageDuration: 75,

    minConnections: 5,
    maxConnections: 20,
    medianConnections: 10,
    averageConnections: 12,

    registeredClassroomsCount: 100,
    connectedClassroomsCount: 80,
    contributedClassroomsCount: 50,
  },
];
