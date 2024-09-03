import { mockClassroomsStats } from '../mocks/mocks';

interface SumData {
  country: string;
  total: number;
  totalactivities: number;
  totalComments: number;
  totalVideos: number;
}

const sumAll: { [country: string]: SumData } = {};

mockClassroomsStats.forEach((country) => {
  const { classroomCountryCode, commentsCount, activities } = country;

  if (!sumAll[classroomCountryCode]) {
    sumAll[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
      totalComments: 0,
      totalactivities: 0,
      totalVideos: 0,
    };
  }

  sumAll[classroomCountryCode].total += commentsCount;

  activities.forEach((activity) => {
    sumAll[classroomCountryCode].total += activity.count;
  });
});

const dataset: { country: string; total: number }[] = Object.values(sumAll);

export const sumAllData = dataset;

const sumComments: { [country: string]: SumData } = {};

mockClassroomsStats.forEach((country) => {
  const { classroomCountryCode, commentsCount } = country;

  if (!sumComments[classroomCountryCode]) {
    sumComments[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
      totalactivities: 0,
      totalComments: 0,
      totalVideos: 0,
    };
  }

  sumComments[classroomCountryCode].totalComments += commentsCount;
});

const datasetComments: { country: string; totalComments: number }[] = Object.values(sumComments);

export const sumAllComments = datasetComments;

const sumActivities: { [country: string]: SumData } = {};

mockClassroomsStats.forEach((country) => {
  const { classroomCountryCode, activities } = country;

  if (!sumActivities[classroomCountryCode]) {
    sumActivities[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
      totalactivities: 0,
      totalComments: 0,
      totalVideos: 0,
    };
  }

  activities.forEach((activity) => {
    sumAll[classroomCountryCode].total += activity.count;
  });
});

const datasetActivities: { country: string; totalactivities: number }[] = Object.values(sumActivities);

export const sumAllActivities = datasetActivities;

const sumVideos: { [country: string]: SumData } = {};

mockClassroomsStats.forEach((country) => {
  const { classroomCountryCode, videosCount } = country;

  if (!sumActivities[classroomCountryCode]) {
    sumActivities[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
      totalactivities: 0,
      totalComments: 0,
      totalVideos: 0,
    };
  }

  sumActivities[classroomCountryCode].totalComments += videosCount;
});

const datasetVideos: { country: string; totalVideos: number }[] = Object.values(sumVideos);

export const sumAllVideos = datasetVideos;
