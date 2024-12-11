import { mockClassroomsStats } from '../mocks/mocks';

interface SumData {
  country: string;
  total: number;
  totalActivities: number;
  totalComments: number;
  totalVideos: number;
}

export const sumContribution = mockClassroomsStats.reduce((data: { [country: string]: SumData }, country) => {
  const { classroomCountryCode, commentsCount, activities, videosCount } = country;

  if (!data[classroomCountryCode]) {
    data[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
      totalComments: 0,
      totalActivities: 0,
      totalVideos: 0,
    };
  }

  data[classroomCountryCode].totalComments += commentsCount;
  data[classroomCountryCode].totalVideos += videosCount;

  activities.forEach((activity) => {
    data[classroomCountryCode].total += activity.count;
    data[classroomCountryCode].totalActivities += activity.count;
  });

  data[classroomCountryCode].total += commentsCount;

  return data;
}, {});

export const sumAllData = Object.values(sumContribution).map(({ country, total }) => ({ country, total }));
