import type { Request } from 'express';

import type { StatsFilterParams } from '../../../types/statistics.type';
import { GroupType } from '../../../types/statistics.type';
import { Classroom } from '../../entities/classroom';
import {
  getConnectedClassroomsCount,
  getRegisteredClassroomsCount,
  getChildrenCodesCountForClassroom,
  getConnectedFamiliesCountForClassroom,
  getFamiliesWithoutAccountForClassroom,
  getContributedClassroomsCount,
} from '../../stats/classroomStats';
import { getBarChartData } from '../../stats/connectionStats';
import { getFamiliesWithoutAccountForCountry } from '../../stats/countryStats';
import { getFamiliesWithoutAccountForGlobal } from '../../stats/globalStats';
import { getChildrenCodesCount, getConnectedFamiliesCount, getFamilyAccountsCount, getFloatingAccounts } from '../../stats/queryStatsByFilter';
import {
  getAverageConnections,
  getAverageDuration,
  getClassroomCount,
  getMaxConnections,
  getMaxDuration,
  getMedianConnections,
  getMedianDuration,
  getMinConnections,
  getMinDuration,
  getUserConnectionsList,
} from '../../stats/sessionStats';
import { getFamiliesWithoutAccountForVillage } from '../../stats/villageStats';
import { AppDataSource } from '../../utils/data-source';
import { Controller } from '../controller';
import type { StatisticsDto } from './statistics.dto';
import { getActivityTypeCountByVillages } from './statistics.repository';

const classroomRepository = AppDataSource.getRepository(Classroom);
export const statisticsController = new Controller('/statistics');

const constructFamilyResponseFromFilters = async (filters: StatsFilterParams) => {
  const filtersFamily = { ...(filters || {}), groupType: GroupType.FAMILY };

  const minDuration = await getMinDuration(filtersFamily);
  const maxDuration = await getMaxDuration(filtersFamily);
  const averageDuration = await getAverageDuration(filtersFamily);
  const medianDuration = await getMedianDuration(filtersFamily);

  const minConnections = await getMinConnections(filtersFamily);
  const maxConnections = await getMaxConnections(filtersFamily);
  const averageConnections = await getAverageDuration(filtersFamily);
  const medianConnections = await getMedianConnections(filtersFamily);

  const familyAccountsCount = await getFamilyAccountsCount(filtersFamily);
  const childrenCodesCount = await getChildrenCodesCount(filtersFamily);
  const connectedFamiliesCount = await getConnectedFamiliesCount(filtersFamily);
  const floatingAccounts = await getFloatingAccounts(filtersFamily);

  return {
    minDuration,
    maxDuration,
    averageDuration,
    medianDuration,

    minConnections,
    maxConnections,
    averageConnections,
    medianConnections,

    familyAccountsCount,
    childrenCodesCount,
    connectedFamiliesCount,
    floatingAccounts,
  };
};

statisticsController.get({ path: '/sessions' }, async (req: Request, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : undefined;
  const countryCode = req.query.countryCode ? (req.query.countryCode as string) : undefined;
  const classroomId = req.query.classroomId ? parseInt(req.query.classroomId as string) : undefined;
  // const phase = req.params.phase ? parseInt(req.params.phase) : null;

  const filters: StatsFilterParams = { villageId, countryId: countryCode, classroomId, phase: undefined };

  try {
    // Appelez les fonctions avec villageId
    const minDuration = await getMinDuration(filters);
    const maxDuration = await getMaxDuration(filters);
    const averageDuration = await getAverageDuration(filters);
    const medianDuration = await getMedianDuration(filters);
    const minConnections = await getMinConnections(filters);
    const maxConnections = await getMaxConnections(filters);
    const averageConnections = await getAverageConnections(filters);
    const medianConnections = await getMedianConnections(filters);
    const testConnections = await getUserConnectionsList();
    const registeredClassroomsCount = await getClassroomCount(villageId, countryCode, classroomId);
    const connectedClassroomsCount = await getConnectedClassroomsCount(villageId, countryCode, classroomId);
    const contributedClassroomsCount = await getContributedClassroomsCount(villageId, countryCode, classroomId);
    const connectedFamiliesCount = await getConnectedFamiliesCount(filters);
    const familyAccountCount = await getFamilyAccountsCount(filters);
    const childrenCodesCount = await getChildrenCodesCount(filters);
    const barChartData = await getBarChartData();

    return res.sendJSON({
      minDuration,
      maxDuration,
      averageDuration,
      medianDuration,
      minConnections,
      maxConnections,
      averageConnections,
      medianConnections,
      testConnections,
      registeredClassroomsCount,
      connectedClassroomsCount,
      contributedClassroomsCount,
      connectedFamiliesCount,
      familyAccountCount,
      childrenCodesCount,
      barChartData,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

statisticsController.get({ path: '/sessions/:phase' }, async (req: Request, res) => {
  // const phase = req.params.phase ? parseInt(req.params.phase) : null;

  res.sendJSON({
    minDuration: await getMinDuration(), // TODO - add phase
    maxDuration: await getMaxDuration(), // TODO - add phase
    averageDuration: await getAverageDuration(), // TODO - add phase
    medianDuration: await getMedianDuration(), // TODO - add phase
    minConnections: await getMinConnections(), // TODO - add phase
    maxConnections: await getMaxConnections(), // TODO - add phase
    averageConnections: await getAverageConnections(), // TODO - add phase
    medianConnections: await getMedianConnections(), // TODO - add phase
    registeredClassroomsCount: await getRegisteredClassroomsCount(),
    connectedClassroomsCount: await getConnectedClassroomsCount(), // TODO - add phase
    // contributedClassroomsCount: await getContributedClassroomsCount(phase),
  });
});

statisticsController.get({ path: '/classrooms' }, async (req, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : null;
  const countryCode = req.query.countryCode ? (req.query.countryCode as string) : null;
  const classroomId = req.query.classroomId ? parseInt(req.query.classroomId as string) : null;

  const queryBuilder = classroomRepository
    .createQueryBuilder('classroom')
    .leftJoin('classroom.village', 'village')
    .leftJoin('classroom.user', 'user')
    .addSelect('classroom.id', 'classroomId')
    .addSelect('classroom.name', 'classroomName')
    .addSelect('classroom.countryCode', 'classroomCountryCode')
    .addSelect('village.id', 'villageId')
    .addSelect('village.name', 'villageName')
    .addSelect('user.id', 'userId')
    .addSelect('user.firstname', 'userFirstname')
    .addSelect('user.lastname', 'userLastname')
    .addSelect(
      `(SELECT COUNT(comment.id)
      FROM comment
      WHERE comment.userId = user.id) AS commentsCount`,
    )
    .addSelect(
      `(SELECT COUNT(video.id)
      FROM video
      WHERE video.userId = user.id) AS videosCount`,
    )
    .addSelect(
      `(SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'phase', ac.phase,
          'activities', ac.activities
        )
      )
      FROM (
        SELECT
          activity.phase,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'type', activity.type,
              'count', activity.totalActivities
            )
          ) AS activities
        FROM (
          SELECT
            activity.phase,
            activity.type,
            COUNT(activity.id) AS totalActivities
          FROM activity
          WHERE activity.userId = user.id
            AND activity.villageId = classroom.villageId
            AND activity.deleteDate IS NULL
          GROUP BY activity.phase, activity.type
        ) AS activity
        GROUP BY activity.phase
      ) AS ac
    ) AS activitiesCount`,
    )
    .groupBy('classroom.id')
    .addGroupBy('user.id');

  if (villageId) {
    queryBuilder.where('village.id = :villageId', { villageId });
  }

  if (countryCode) {
    queryBuilder.where('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    queryBuilder.where('classroom.id = :classroomId', { classroomId });
  }

  const classroomsData = await queryBuilder.getRawMany();

  // const transformedData = classroomsData.map((classroom) => ({
  //   classroomId: classroom.classroomId,
  //   classroomName: classroom.classroomName,
  //   classroomCountryCode: classroom.classroomCountryCode,
  //   villageId: classroom.villageId,
  //   villageName: classroom.villageName,
  //   commentsCount: parseInt(classroom.commentsCount, 10),
  //   videosCount: parseInt(classroom.videosCount, 10),
  //   userFirstName: classroom.userFirstname,
  //   userLastName: classroom.userLastname,
  //   activities: classroom.activitiesCount
  //     ? classroom.activitiesCount.flatMap((phaseObj: { activities: any[]; phase: string }) =>
  //         phaseObj.activities.map((activity) => ({
  //           count: activity.count,
  //           type: activity.type,
  //           phase: phaseObj.phase,
  //         })),
  //       )
  //     : [],
  // }));

  // const result = { data: [...transformedData], phases: normalizeForCountry(transformedData) };

  res.sendJSON(classroomsData);
});

statisticsController.get({ path: '/one-village' }, async (req, res) => {
  const phase = req.query.phase as unknown as number;

  const filters: StatsFilterParams = {};

  const family = {
    ...(await constructFamilyResponseFromFilters(filters)),
    //TODO refactor getFamiliesWithoutAccount
    familiesWithoutAccount: await getFamiliesWithoutAccountForGlobal(),
  };

  const activityCountDetails = await getActivityTypeCountByVillages({ phase });

  const response: StatisticsDto = {
    family,
    activityCountDetails,
  };

  res.sendJSON(response);
});

statisticsController.get({ path: '/villages/:villageId' }, async (req, res) => {
  const villageId = parseInt(req.params.villageId);
  const { countryCode } = req.params;
  const phase = req.query.phase as unknown as number;
  const filters: StatsFilterParams = { villageId, phase };

  const family = {
    ...(await constructFamilyResponseFromFilters(filters)),
    //TODO refactor getFamiliesWithoutAccount
    familiesWithoutAccount: await getFamiliesWithoutAccountForVillage(villageId),
  };

  const activityCountDetails = await getActivityTypeCountByVillages({ phase, countryCode, villageId });

  res.sendJSON({
    family,
    activityCountDetails,
  });
});

statisticsController.get({ path: '/countries/:countryCode' }, async (req, res) => {
  const { countryCode } = req.params;
  const phase = req.query.phase as unknown as number;

  const filters: StatsFilterParams = { countryId: countryCode, phase };

  const family = {
    ...(await constructFamilyResponseFromFilters(filters)),
    //TODO refactor getFamiliesWithoutAccount
    familiesWithoutAccount: await getFamiliesWithoutAccountForCountry(countryCode),
  };

  const activityCountDetails = await getActivityTypeCountByVillages({ phase, countryCode });

  res.sendJSON({
    family,
    activityCountDetails,
  });
});

statisticsController.get({ path: '/classrooms/:classroomId' }, async (req, res) => {
  const classroomId = parseInt(req.params.classroomId);
  const { countryCode } = req.params;
  const phase = req.query.phase as unknown as number;

  const filters: StatsFilterParams = { classroomId, phase };

  const minDuration = await getMinDuration(filters);
  const maxDuration = await getMaxDuration(filters);
  const averageDuration = await getAverageDuration(filters);
  const medianDuration = await getMedianDuration(filters);

  const minConnections = await getMinConnections(filters);
  const maxConnections = await getMaxConnections(filters);
  const averageConnections = await getAverageDuration(filters);
  const medianConnections = await getMedianConnections(filters);

  const childrenCodesCount = await getChildrenCodesCountForClassroom(classroomId, phase);
  const connectedFamiliesCount = await getConnectedFamiliesCountForClassroom(classroomId, phase);
  const familiesWithoutAccount = await getFamiliesWithoutAccountForClassroom(classroomId);

  const activityCountDetails = await getActivityTypeCountByVillages({ phase, countryCode, classroomId });

  const response: StatisticsDto = {
    family: {
      minDuration,
      maxDuration,
      averageDuration,
      medianDuration,

      minConnections,
      maxConnections,
      averageConnections,
      medianConnections,

      childrenCodesCount,
      connectedFamiliesCount,
      familiesWithoutAccount,
    },
    activityCountDetails,
  };

  res.sendJSON(response);
});
