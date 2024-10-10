import type { Request } from 'express';

import {
  getClassroomsInfos,
  getConnectedClassroomsCount,
  getContributedClassroomsCount,
  getRegisteredClassroomsCount,
} from '../stats/classroomStats';
import {
  getAverageConnections,
  getAverageDuration,
  getMaxConnections,
  getMaxDuration,
  getMedianConnections,
  getMedianDuration,
  getMinConnections,
  getMinDuration,
  getUserConnectionsList,
} from '../stats/sessionStats';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

statisticsController.get({ path: '/sessions' }, async (req: Request, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : null;
  // const phase = req.params.phase ? parseInt(req.params.phase) : null;

  if (!villageId) {
    return res.status(400).json({ message: 'Village ID is required' });
  }

  try {
    // Appelez les fonctions avec villageId
    const minDuration = await getMinDuration(villageId);
    const maxDuration = await getMaxDuration(villageId);
    const averageDuration = await getAverageDuration(villageId);
    const medianDuration = await getMedianDuration(villageId); // TODO - add phase
    const minConnections = await getMinConnections(villageId); // TODO - add phase
    const maxConnections = await getMaxConnections(villageId); // TODO - add phase
    const averageConnections = await getAverageConnections(villageId); // TODO - add phase
    const medianConnections = await getMedianConnections(villageId); // TODO - add phase
    const testConnections = await getUserConnectionsList();
    const registeredClassroomsCount = await getRegisteredClassroomsCount(villageId);
    const connectedClassroomsCount = await getConnectedClassroomsCount(villageId); // TODO - add phase
    // const contributedClassroomsCount = await getContributedClassroomsCount(villageId);

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
      // contributedClassroomsCount,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
  const classroomsData = await classroomRepository
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
    .addGroupBy('user.id')
    .getRawMany();

  res.sendJSON(
    classroomsData.map((classroom) => ({
      ...classroom,
      commentsCount: parseInt(classroom.commentsCount, 10),
      videosCount: parseInt(classroom.videosCount, 10),
    })),
  );
});

statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
  res.sendJSON({
    classrooms: await getClassroomsInfos(),
  });
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

statisticsController.get({ path: '/classrooms/:classroomId' }, async (_req, res) => {
  const classroomId = parseInt(_req.params.classroomId);
  const phase = _req.query.phase as unknown as number;
  res.sendJSON({
    childrenCodesCount: await getChildrenCodesCountForClassroom(classroomId, phase),
    connectedFamiliesCount: await getConnectedFamiliesCountForClassroom(classroomId, phase),
    familiesWithoutAccount: await getFamiliesWithoutAccountForClassroom(classroomId),
  });
});
