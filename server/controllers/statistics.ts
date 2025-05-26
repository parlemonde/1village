import type { Request } from 'express';

import type { StatsFilterParams } from '../../types/statistics.type';
import { Classroom } from '../entities/classroom';
import {
  getConnectedClassroomsCount,
  getRegisteredClassroomsCount,
  getChildrenCodesCountForClassroom,
  getConnectedFamiliesCountForClassroom,
  getFamiliesWithoutAccountForClassroom,
  getContributedClassroomsCount,
} from '../stats/classroomStats';
import { getBarChartData } from '../stats/connectionStats';
import {
  getChildrenCodesCountForCountry,
  getConnectedFamiliesCountForCountry,
  getFamiliesWithoutAccountForCountry,
  getFamilyAccountsCountForCountry,
  getFloatingAccountsForCountry,
} from '../stats/countryStats';
import {
  getChildrenCodesCountForGlobal,
  getConnectedFamiliesCountForGlobal,
  getFamiliesWithoutAccountForGlobal,
  getFamilyAccountsCountForGlobal,
  getFloatingAccountsForGlobal,
} from '../stats/globalStats';
import { getChildrenCodesCount, getConnectedFamiliesCount, getFamilyAccountsCount } from '../stats/queryStatsByFilter';
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
} from '../stats/sessionStats';
import {
  getChildrenCodesCountForVillage,
  getConnectedFamiliesCountForVillage,
  getFamiliesWithoutAccountForVillage,
  getFamilyAccountsCountForVillage,
  getFloatingAccountsForVillage,
} from '../stats/villageStats';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const classroomRepository = AppDataSource.getRepository(Classroom);
export const statisticsController = new Controller('/statistics');

statisticsController.get({ path: '/sessions' }, async (req: Request, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : undefined;
  const countryCode = req.query.countryCode ? (req.query.countryCode as string) : undefined;
  const classroomId = req.query.classroomId ? parseInt(req.query.classroomId as string) : undefined;
  // const phase = req.params.phase ? parseInt(req.params.phase) : null;

  const filters: StatsFilterParams = { villageId, countryId: countryCode, classroomId, phase: undefined };

  try {
    // Appelez les fonctions avec villageId
    const minDuration = await getMinDuration(villageId, countryCode, classroomId);
    const maxDuration = await getMaxDuration(villageId, countryCode, classroomId);
    const averageDuration = await getAverageDuration(villageId, countryCode, classroomId);
    const medianDuration = await getMedianDuration(villageId, countryCode, classroomId);
    const minConnections = await getMinConnections(villageId, countryCode, classroomId);
    const maxConnections = await getMaxConnections(villageId, countryCode, classroomId);
    const averageConnections = await getAverageConnections(villageId, countryCode, classroomId);
    const medianConnections = await getMedianConnections(villageId, countryCode, classroomId);
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

statisticsController.get({ path: '/onevillage' }, async (_req, res) => {
  res.sendJSON({
    familyAccountsCount: await getFamilyAccountsCountForGlobal(),
    childrenCodesCount: await getChildrenCodesCountForGlobal(),
    connectedFamiliesCount: await getConnectedFamiliesCountForGlobal(),
    familiesWithoutAccount: await getFamiliesWithoutAccountForGlobal(),
    floatingAccounts: await getFloatingAccountsForGlobal(),
  });
});

statisticsController.get({ path: '/villages/:villageId' }, async (_req, res) => {
  const villageId = parseInt(_req.params.villageId);
  const phase = _req.query.phase as unknown as number;
  res.sendJSON({
    familyAccountsCount: await getFamilyAccountsCountForVillage(villageId, phase),
    childrenCodesCount: await getChildrenCodesCountForVillage(villageId, phase),
    connectedFamiliesCount: await getConnectedFamiliesCountForVillage(villageId, phase),
    familiesWithoutAccount: await getFamiliesWithoutAccountForVillage(villageId),
    floatingAccounts: await getFloatingAccountsForVillage(villageId),
  });
});

statisticsController.get({ path: '/countries/:countryId' }, async (_req, res) => {
  const countryId = _req.params.countryId;
  const phase = _req.query.phase as unknown as number;
  res.sendJSON({
    familyAccountsCount: await getFamilyAccountsCountForCountry(countryId, phase),
    childrenCodesCount: await getChildrenCodesCountForCountry(countryId, phase),
    connectedFamiliesCount: await getConnectedFamiliesCountForCountry(countryId, phase),
    familiesWithoutAccount: await getFamiliesWithoutAccountForCountry(countryId),
    floatingAccounts: await getFloatingAccountsForCountry(countryId),
  });
});

statisticsController.get({ path: '/classrooms/:classroomId' }, async (_req, res) => {
  const classroomId = parseInt(_req.params.classroomId);
  const phase = _req.query.phase as unknown as number;
  res.sendJSON({
    childrenCodesCount: await getChildrenCodesCountForClassroom(classroomId, phase),
    connectedFamiliesCount: await getConnectedFamiliesCountForClassroom(classroomId, phase),
    familiesWithoutAccount: await getFamiliesWithoutAccountForClassroom(classroomId),
  });
});
