import type { ClassroomsStats, ConnectionsStats } from 'types/statistics.type';

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
    activitiesCount: [
      {
        phase: 1,
        activities: [
          { count: 10, type: 1 },
          { count: 15, type: 2 },
        ],
      },
      {
        phase: 2,
        activities: [
          { count: 5, type: 3 },
          { count: 7, type: 4 },
        ],
      },
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
    activitiesCount: [
      {
        phase: 1,
        activities: [
          { count: 12, type: 1 },
          { count: 20, type: 2 },
        ],
      },
    ],
  },
  {
    classroomId: 3,
    classroomCountryCode: 'FR',
    villageId: 1,
    villageName: 'Village C',
    commentsCount: 40,
    videosCount: 2,
    userFirstName: 5,
    userLastName: 5,
    activitiesCount: [
      {
        phase: 1,
        activities: [
          { count: 10, type: 1 },
          { count: 15, type: 2 },
        ],
      },
      {
        phase: 2,
        activities: [
          { count: 5, type: 3 },
          { count: 7, type: 4 },
        ],
      },
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
    activitiesCount: [
      {
        phase: 1,
        activities: [
          { count: 10, type: 1 },
          { count: 15, type: 2 },
        ],
      },
      {
        phase: 2,
        activities: [
          { count: 5, type: 3 },
          { count: 7, type: 4 },
        ],
      },
    ],
  },
];

export const mockConnectionsStats: ConnectionsStats[] = [
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
