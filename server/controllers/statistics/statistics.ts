import type { Request } from 'express';

import { Classroom } from '../../entities/classroom';
import { getClassroomsInfos, getConnectedClassroomsCount, getContributedClassroomsCount } from '../../stats/classroomStats';
import { getBarChartData } from '../../stats/connectionStats';
import {
  getChildrenCodesCountForCountry,
  getConnectedFamiliesCountForCountry,
  getFamiliesWithoutAccountForCountry,
  getFamilyAccountsCountForCountry,
  getFloatingAccountsForCountry,
} from '../../stats/countryStats';
import {
  getChildrenCodesCountForGlobal,
  getConnectedFamiliesCountForGlobal,
  getFamiliesWithoutAccountForGlobal,
  getFamilyAccountsCountForGlobal,
  getFloatingAccountsForGlobal,
} from '../../stats/globalStats';
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
import {
  getChildrenCodesCountForVillage,
  getConnectedFamiliesCountForVillage,
  getFamiliesWithoutAccountForVillage,
  getFloatingAccountsForVillage,
  getFamilyAccountsCountForVillage,
} from '../../stats/villageStats';
import { AppDataSource } from '../../utils/data-source';
import { Controller } from '../controller';
import type { StatisticsDto } from './statistics.dto';
import { getExchanges } from './statistics.repository';

const classroomRepository = AppDataSource.getRepository(Classroom);
export const statisticsController = new Controller('/statistics');

statisticsController.get({ path: '/sessions' }, async (req: Request, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : null;
  const countryCode = req.query.countryCode ? (req.query.countryCode as string) : null;
  const classroomId = req.query.classroomId ? parseInt(req.query.classroomId as string) : null;
  // const phase = req.params.phase ? parseInt(req.params.phase) : null;
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
      barChartData,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
  res.sendJSON({
    classrooms: await getClassroomsInfos(),
  });
});

statisticsController.get({ path: '/onevillage' }, async (_req, res) => {
  const familyAccountsCount = await getFamilyAccountsCountForGlobal();
  const childrenCodesCount = await getChildrenCodesCountForGlobal();
  const connectedFamiliesCount = await getConnectedFamiliesCountForGlobal();
  const familiesWithoutAccount = await getFamiliesWithoutAccountForGlobal();
  const floatingAccounts = await getFloatingAccountsForGlobal();
  const exchanges = await getExchanges();

  const statistics: StatisticsDto = {
    familyAccountsCount,
    childrenCodesCount,
    connectedFamiliesCount,
    familiesWithoutAccount,
    floatingAccounts,
    exchanges,
  };

  res.sendJSON(statistics);
});

statisticsController.get({ path: '/villages/:villageId' }, async (req, res) => {
  const villageId = parseInt(req.params.villageId);
  const phase = req.query.phase as unknown as number;

  const familyAccountsCount = await getFamilyAccountsCountForVillage(villageId, phase);
  const childrenCodesCount = await getChildrenCodesCountForVillage(villageId, phase);
  const connectedFamiliesCount = await getConnectedFamiliesCountForVillage(villageId, phase);
  const familiesWithoutAccount = await getFamiliesWithoutAccountForVillage(villageId);
  const floatingAccounts = await getFloatingAccountsForVillage(villageId);

  const statistics: StatisticsDto = {
    familyAccountsCount,
    childrenCodesCount,
    connectedFamiliesCount,
    familiesWithoutAccount,
    floatingAccounts,
    exchanges: {
      videosCount: 100,
      publicationsCount: 100,
      commentsCount: 100,
    },
  };

  res.sendJSON(statistics);
});

statisticsController.get({ path: '/countries/:countryCode' }, async (req, res) => {
  const { countryCode } = req.params;
  const phaseId = req.query.phase as unknown as number;

  const familyAccountsCount = await getFamilyAccountsCountForCountry(countryCode, phaseId);
  const childrenCodesCount = await getChildrenCodesCountForCountry(countryCode, phaseId);
  const connectedFamiliesCount = await getConnectedFamiliesCountForCountry(countryCode, phaseId);
  const familiesWithoutAccount = await getFamiliesWithoutAccountForCountry(countryCode);
  const floatingAccounts = await getFloatingAccountsForCountry(countryCode);
  const exchanges = await getExchanges({ countryCode, phaseId });

  const statistics: StatisticsDto = {
    familyAccountsCount,
    childrenCodesCount,
    connectedFamiliesCount,
    familiesWithoutAccount,
    floatingAccounts,
    exchanges,
  };

  res.sendJSON(statistics);
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
