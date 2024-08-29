import { mockClassroomsStats } from '../mocks/mocks';

interface SumData {
  country: string;
  total: number;
}

const sumActivities: { [country: string]: SumData } = {};

mockClassroomsStats.forEach((country) => {
  const { classroomCountryCode, commentsCount, activities } = country;

  if (!sumActivities[classroomCountryCode]) {
    sumActivities[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
    };
  }

  sumActivities[classroomCountryCode].total += commentsCount;

  activities.forEach((activity) => {
    sumActivities[classroomCountryCode].total += activity.count;
  });
});

const dataset: { country: string; total: number }[] = Object.values(sumActivities);

export const sumData = dataset;
