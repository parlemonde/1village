import type { Request } from 'express';

import { Classroom } from '../entities/classroom';
import {
  getClassroomsInfos,
  getConnectedClassroomsCount,
  getContributedClassroomsCount,
  getRegisteredClassroomsCount,
  normalizeForCountry,
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
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

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
    const registeredClassroomsCount = await getRegisteredClassroomsCount(villageId);
    const connectedClassroomsCount = await getConnectedClassroomsCount(villageId);
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

  const transformedData = classroomsData.map((classroom) => ({
    classroomId: classroom.classroomId,
    classroomName: classroom.classroomName,
    classroomCountryCode: classroom.classroomCountryCode,
    villageId: classroom.villageId,
    villageName: classroom.villageName,
    commentsCount: parseInt(classroom.commentsCount, 10),
    videosCount: parseInt(classroom.videosCount, 10),
    userFirstName: classroom.userFirstname,
    userLastName: classroom.userLastname,
    activities: classroom.activitiesCount
      ? classroom.activitiesCount.flatMap((phaseObj) =>
          phaseObj.activities.map((activity) => ({
            count: activity.count,
            type: activity.type,
            phase: phaseObj.phase,
          })),
        )
      : [], // Si activitiesCount est null, retourner une liste vide
  }));

  const result = { data: [...transformedData], phases: normalizeForCountry(transformedData) };

  res.sendJSON(classroomsData);

  // res.sendJSON(
  //   classroomsData.map((classroom) => ({
  //     ...classroom,
  //     commentsCount: parseInt(classroom.commentsCount, 10),
  //     videosCount: parseInt(classroom.videosCount, 10),
  //   })),
  // );
});

// statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
//   res.sendJSON({
//     classrooms: await getClassroomsInfos(),
//   });
// });
