import type { Request } from 'express';

import type { ClassroomDetails, CountryEngagementStatus, EngagementStatus, StatsFilterParams } from '../../../types/statistics.type';
import { GroupType } from '../../../types/statistics.type';
import { Activity } from '../../entities/activity';
import { AnalyticSession } from '../../entities/analytic';
import { Classroom } from '../../entities/classroom';
import { Comment } from '../../entities/comment';
import { User } from '../../entities/user';
import { Village } from '../../entities/village';
import {
  getConnectedClassroomsCount,
  getRegisteredClassroomsCount,
  getChildrenCodesCountForClassroom,
  getConnectedFamiliesCountForClassroom,
  getFamiliesWithoutAccountForClassroom,
  getContributedClassroomsCount,
  getContributionsBarChartData,
} from '../../stats/classroomStats';
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
import {
  getDetailedActivitiesCountsByClassrooms,
  getDetailedActivitiesCountsByCountries,
  getDetailedActivitiesCountsByVillage,
  getDetailedActivitiesCountsByVillages,
  getTotalActivitiesCounts,
  getTotalActivitiesCountsByClassroomId,
  getTotalActivitiesCountsByCountryCode,
  getTotalActivitiesCountsByVillageId,
  getDailyConnectionsCountsByMonth,
} from './statistics.repository';

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

  const dailyConnectionsCountsByMonth = await getDailyConnectionsCountsByMonth(filtersFamily);

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

    dailyConnectionsCountsByMonth,
  };
};

statisticsController.get({ path: '/sessions' }, async (req: Request, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : undefined;
  const countryCode = req.query.countryCode ? (req.query.countryCode as string) : undefined;
  const classroomId = req.query.classroomId ? parseInt(req.query.classroomId as string) : undefined;
  const phase = req.query.phase ? parseInt(req.query.phase as string) : undefined;

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
    const contributedClassroomsCount = await getContributedClassroomsCount(villageId, countryCode, classroomId, phase);
    const connectedFamiliesCount = await getConnectedFamiliesCount(filters);
    const familyAccountCount = await getFamilyAccountsCount(filters);
    const childrenCodesCount = await getChildrenCodesCount(filters);
    const dailyConnectionsCountsByMonth = await getDailyConnectionsCountsByMonth();
    const contributionsBarChartData = await getContributionsBarChartData(villageId, countryCode, classroomId);

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
      dailyConnectionsCountsByMonth,
      contributionsBarChartData,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

statisticsController.get({ path: '/sessions/:phase' }, async (req: Request, res) => {
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
  });
});

statisticsController.get({ path: '/classrooms-to-monitor' }, async (req, res) => {
  const villageId = req.query.village ? parseInt(req.query.village as string) : null;
  const countryCode = req.query.country ? (req.query.country as string) : null;
  let queryBuilder = classroomRepository
    .createQueryBuilder('classroom')
    .select([
      'classroom.id AS id',
      'COALESCE(classroom.name, user.displayName) AS name',
      `JSON_OBJECT(
        'id', user.id,
        'firstname', user.firstname,
        'lastname', user.lastname,
        'pseudo', user.pseudo,
        'displayName', user.displayName,
        'email', user.email,
        'countryCode', user.countryCode,
        'school', user.school,
        'city', user.city,
        'level', user.level,
        'createdAt', user.createdAt
      ) as user`,
      'village.name AS vm',
      "COALESCE(NULLIF(CONCAT(user.firstname, ' ', user.lastname), ' '), user.pseudo) AS teacher",
      `CASE
      WHEN MAX(a.date) IS NULL THEN 0
      WHEN MAX(a.date) < (NOW() - INTERVAL 21 DAY) THEN 1
      WHEN COUNT(DISTINCT act.id) >= 3 THEN 2
      ELSE NULL
    END AS status`,
    ])
    .leftJoin('user', 'user', 'user.id = classroom.userId')
    .leftJoin('village', 'village', 'village.id = classroom.villageId')
    .leftJoin('analytic_session', 'a', 'a.userId = classroom.userId')
    .leftJoin('activity', 'act', 'act.userId = classroom.userId AND act.status = 1 AND act.villageId = classroom.villageId')
    .groupBy('classroom.id')
    .addGroupBy('village.name')
    .addGroupBy('village.id')
    .addGroupBy('user.firstname')
    .addGroupBy('user.lastname')
    .addGroupBy('user.pseudo')
    .addGroupBy('user.displayName')
    .addGroupBy('user.id')
    .addGroupBy('user.email')
    .addGroupBy('user.countryCode')
    .addGroupBy('user.school')
    .addGroupBy('user.city')
    .addGroupBy('user.level')
    .addGroupBy('user.createdAt')
    .having('(MAX(a.date) IS NULL OR MAX(a.date) < (NOW() - INTERVAL 21 DAY)) OR COUNT(DISTINCT act.id) >= 3');

  if (countryCode) {
    queryBuilder = queryBuilder.andWhere('FIND_IN_SET(:countryCode, village.countryCodes) > 0', { countryCode });
  }
  if (villageId) {
    queryBuilder = queryBuilder.andWhere('village.id = :villageId', { villageId });
  }

  const classroomsData = await queryBuilder.getRawMany();

  res.sendJSON(classroomsData);
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

  res.sendJSON(classroomsData);
});

statisticsController.get({ path: '/classrooms-engagement-status' }, async (req, res) => {
  const villageId = req.query.villageId ? parseInt(req.query.villageId as string) : null;
  const countryCode = req.query.countryCode ? (req.query.countryCode as string) : null;

  const conditionOnVillageId = villageId ? ` AND cla.villageId = ${villageId}` : '';
  const conditionOnCountryCode = countryCode ? ` AND cla.countryCode = '${countryCode}'` : '';

  const additionalCondition: string = conditionOnVillageId || conditionOnCountryCode;
  const queryBuilder = AppDataSource.createQueryBuilder()
    .select('statusCounts.status', 'status')
    .addSelect('COUNT(*)', 'statusCount')
    .from((subQb) => {
      return subQb
        .select('u.id', 'userId')
        .addSelect('cla.id', 'classroomId')
        .addSelect(
          `
            CASE
              WHEN MAX(sess.date) IS NULL OR MAX(sess.date) < (NOW() - INTERVAL 21 DAY) THEN 'ghost'
              WHEN MAX(act.publishDate) >= (NOW() - INTERVAL 21 DAY)
                OR MAX(com.createDate) >= (NOW() - INTERVAL 21 DAY) THEN 'active'
              ELSE 'observer'
            END
          `,
          'status',
        )
        .from(User, 'u')
        .leftJoin(AnalyticSession, 'sess', 'u.id = sess.userId')
        .leftJoin(Activity, 'act', 'u.id = act.userId AND act.status = 0 AND act.deleteDate IS NULL')
        .leftJoin(Comment, 'com', 'u.id = com.userId')
        .innerJoin(Classroom, 'cla', `u.id = cla.userId${additionalCondition}`)
        .groupBy('u.id')
        .addGroupBy('cla.id');
    }, 'statusCounts')
    .groupBy('statusCounts.status');

  const classroomEngagementStatuses = (
    await queryBuilder.getRawMany<{
      status: EngagementStatus;
      statusCount: string;
    }>()
  ).map((engagementStatus) => ({
    ...engagementStatus,
    statusCount: Number(engagementStatus.statusCount),
  }));

  res.sendJSON(classroomEngagementStatuses);
});

statisticsController.get({ path: '/classrooms/details/:classroomId' }, async (req, res) => {
  const id = parseInt(req.params.classroomId);

  const classroomDetails = await AppDataSource.getRepository(Classroom)
    .createQueryBuilder('class')
    .select([
      'class.id AS id',
      'class.countryCode AS countryCode',
      'v.name AS villageName',
      'COUNT(comment.id) AS commentsCount',
      'COUNT(video.id) AS videosCount',
    ])
    .addSelect(
      `CASE
        WHEN class.name IS NOT NULL THEN class.name
        WHEN u.displayName IS NOT NULL THEN u.displayName
        WHEN u.level IS NOT NULL AND u.city IS NOT NULL THEN CONCAT('La classe de ', u.level, ' à ', u.city)
        WHEN u.city IS NOT NULL THEN CONCAT('La classe de ', u.city)
        ELSE NULL
      END`,
      'classroomName',
    )
    .innerJoin('village', 'v', 'v.id = class.villageId')
    .innerJoin('user', 'u', 'u.id = class.userId')
    .leftJoin('comment', 'comment', 'comment.userId = u.id')
    .leftJoin('video', 'video', 'video.userId = u.id')
    .where('class.id = :id', { id })
    .groupBy('class.id')
    .addGroupBy('u.id')
    .getRawOne<ClassroomDetails>();

  res.sendJSON(classroomDetails);
});

statisticsController.get({ path: '/one-village' }, async (req, res) => {
  const phase = req.query.phase ? parseInt(req.query.phase as string) : undefined;

  const filters: StatsFilterParams = {};

  const family = {
    ...(await constructFamilyResponseFromFilters(filters)),
    //TODO refactor getFamiliesWithoutAccount
    familiesWithoutAccount: await getFamiliesWithoutAccountForGlobal(),
  };

  const totalActivityCounts = await getTotalActivitiesCounts(phase);

  res.sendJSON({ family, totalActivityCounts });
});

statisticsController.get({ path: '/one-village/countries-engagement-statuses' }, async (req, res) => {
  const countryEngagementStatus = await AppDataSource.query<CountryEngagementStatus[]>(`
    WITH countryCTE AS (
      SELECT DISTINCT countryCode
      FROM classroom
    ),
    getUsersStatus AS (
      SELECT
        u.id,
        u.villageId,
        cla.countryCode,
        CASE
          WHEN MAX(sess.date) IS NULL OR MAX(sess.date) < (NOW() - INTERVAL 21 DAY) THEN 'ghost'
          WHEN MAX(act.publishDate) >= (NOW() - INTERVAL 21 DAY)
            OR MAX(com.createDate) >= (NOW() - INTERVAL 21 DAY) THEN 'active'
          ELSE 'observer'
        END AS status
        FROM user u
        LEFT JOIN analytic_session sess ON u.id = sess.userId
        LEFT JOIN activity act ON u.id = act.userId AND act.status = 0 AND act.deleteDate IS NULL
        LEFT JOIN comment com ON u.id = com.userId
        INNER JOIN classroom cla ON u.id = cla.userId
        GROUP BY u.id, u.villageId
    ),
    countryStatuses as (
      SELECT c.countryCode, us.status, COUNT(*) AS statusCount
        FROM countryCTE c
        LEFT OUTER JOIN getUsersStatus us ON us.countryCode = c.countryCode
        GROUP BY c.countryCode, us.status
    )
    SELECT cc.countryCode, cs2.status
      FROM countryCTE cc
      LEFT JOIN (
        SELECT cs1.countryCode, cs1.status, cs1.statusCount
        FROM countryStatuses cs1
        INNER JOIN (
          SELECT countryCode, MAX(statusCount) AS maxCount
          FROM countryStatuses
          GROUP BY countryCode
        ) maxCountryStatuses
        ON cs1.countryCode = maxCountryStatuses.countryCode
        AND cs1.statusCount = maxCountryStatuses.maxCount
      ) cs2 ON cs2.countryCode = cc.countryCode
      ORDER BY cc.countryCode;
`);

  res.sendJSON(countryEngagementStatus);
});

statisticsController.get({ path: '/villages/:villageId' }, async (req, res) => {
  const villageId = parseInt(req.params.villageId);
  const phase = req.query.phase ? parseInt(req.query.phase as string) : undefined;
  const filters: StatsFilterParams = { villageId, phase };

  const family = {
    ...(await constructFamilyResponseFromFilters(filters)),
    //TODO refactor getFamiliesWithoutAccount
    familiesWithoutAccount: await getFamiliesWithoutAccountForVillage(villageId),
  };

  const totalActivityCounts = await getTotalActivitiesCountsByVillageId(villageId, phase);

  res.sendJSON({ family, totalActivityCounts });
});

statisticsController.get({ path: '/villages/:villageId/engagement-status' }, async (req, res) => {
  const villageId = parseInt(req.params.villageId);
  if (isNaN(villageId)) {
    res.status(400).send(`L'identifiant du village est invalide.`);
    return;
  }

  const queryBuilder = AppDataSource.createQueryBuilder()
    .select('getUsersStatus.status', 'status')
    .addSelect('COUNT(*)', 'statusCount')
    .addSelect('getUsersStatus.villageId', 'villageId')
    .from((subQb) => {
      return subQb
        .select('vil.id', 'villageId')
        .addSelect('u.id', 'userId')
        .addSelect(
          `
        CASE
          WHEN MAX(sess.date) IS NULL OR MAX(sess.date) < (NOW() - INTERVAL 21 DAY) THEN 'ghost'
          WHEN MAX(act.publishDate) >= (NOW() - INTERVAL 21 DAY)
            OR MAX(com.createDate) >= (NOW() - INTERVAL 21 DAY) THEN 'active'
          ELSE 'observer'
        END
      `,
          'status',
        )
        .from(Village, 'vil')
        .innerJoin(User, 'u', `u.villageId = vil.id`)
        .leftJoin(AnalyticSession, 'sess', 'sess.userId = u.id')
        .leftJoin(Activity, 'act', 'act.userId = u.id AND act.status = 0 AND act.deleteDate IS NULL')
        .leftJoin(Comment, 'com', 'com.userId = u.id')
        .where('vil.id = :villageId', { villageId })
        .groupBy('userId')
        .addGroupBy('villageId');
    }, 'getUsersStatus')
    .groupBy('getUsersStatus.status')
    .addGroupBy('getUsersStatus.villageId')
    .orderBy('statusCount', 'DESC')
    .limit(1);

  const villageEngagementStatus = await queryBuilder.getRawOne<{
    villageId: Classroom['id'];
    status: string;
    statusCount: number;
  }>();

  res.sendJSON(villageEngagementStatus);
});

statisticsController.get({ path: '/countries/:countryCode' }, async (req, res) => {
  const { countryCode } = req.params;
  const phase = req.query.phase ? parseInt(req.query.phase as string) : undefined;

  const filters: StatsFilterParams = { countryId: countryCode, phase };

  const family = {
    ...(await constructFamilyResponseFromFilters(filters)),
    //TODO refactor getFamiliesWithoutAccount
    familiesWithoutAccount: await getFamiliesWithoutAccountForCountry(countryCode),
  };

  const totalActivityCounts = await getTotalActivitiesCountsByCountryCode(countryCode, phase);

  res.sendJSON({ family, totalActivityCounts });
});

statisticsController.get({ path: '/countries/:countryCode/engagement-status' }, async (req, res) => {
  const countryCode = req.params.countryCode;

  const countryEngagementStatus = await AppDataSource.query<
    {
      countryCode: string;
      status: string;
      statusCount: number;
    }[]
  >(`
    WITH getCountries AS (
      SELECT DISTINCT countryCode
      FROM classroom
    ),
    getUsersStatus AS (
      SELECT
        u.id,
        c.countryCode,
        CASE
          WHEN MAX(sess.date) IS NULL OR MAX(sess.date) < (NOW() - INTERVAL 21 DAY) THEN 'ghost'
          WHEN MAX(act.publishDate) >= (NOW() - INTERVAL 21 DAY)
            OR MAX(com.createDate) >= (NOW() - INTERVAL 21 DAY) THEN 'active'
          ELSE 'observer'
        END AS status
      FROM getCountries c
      INNER JOIN classroom cla ON cla.countryCode = c.countryCode
      INNER JOIN user u ON u.id = cla.userId
      LEFT JOIN analytic_session sess ON sess.userId = u.id
      LEFT JOIN activity act ON act.userId = u.id AND act.status = 0 AND act.deleteDate IS NULL
      LEFT JOIN comment com ON com.userId = u.id
      WHERE c.countryCode = '${countryCode}'
      GROUP BY u.id, u.villageId
    )
    SELECT countryCode, status, COUNT(*) AS statusCount
    FROM getUsersStatus
    GROUP BY countryCode, status
    ORDER BY statusCount DESC;
`);

  if (countryEngagementStatus.length === 0) {
    res.status(501).send(`Le pays sélectionné (${countryCode}) n'est associé à aucune classe. Impossible de déterminer son statut`);
    return;
  }

  res.sendJSON(countryEngagementStatus[0]);
});

statisticsController.get({ path: '/compare/one-village' }, async (req, res) => {
  const phase = typeof req.query.phase === 'string' ? parseInt(req.query.phase) : undefined;

  if (!phase) {
    res.status(403).send(`La phase à observer est manquante`);
    return;
  }

  const activitiesCountsByVillages = await getDetailedActivitiesCountsByVillages(phase);

  res.sendJSON(activitiesCountsByVillages);
});

statisticsController.get({ path: '/compare/countries' }, async (req, res) => {
  const phase = typeof req.query.phase === 'string' ? parseInt(req.query.phase) : undefined;

  if (!phase) {
    res.status(403).send(`La phase à observer est manquante`);
    return;
  }

  const activitiesCountsByCountries = await getDetailedActivitiesCountsByCountries(phase);

  res.sendJSON(activitiesCountsByCountries);
});

statisticsController.get({ path: '/compare/villages/:villageId' }, async (req, res) => {
  const villageId = parseInt(req.params.villageId);
  const phase = typeof req.query.phase === 'string' ? parseInt(req.query.phase) : undefined;

  if (!phase) {
    res.status(403).send(`La phase à observer est manquante`);
    return;
  }

  const activitiesCountsByVillageCountries = await getDetailedActivitiesCountsByVillage(villageId, phase);
  res.sendJSON(activitiesCountsByVillageCountries);
});

statisticsController.get({ path: '/compare/classrooms' }, async (req, res) => {
  const villageId = typeof req.query.villageId === 'string' ? parseInt(req.query.villageId) : undefined;
  const phase = typeof req.query.phase === 'string' ? parseInt(req.query.phase) : undefined;

  if (!villageId || !phase) {
    res.status(403).send(`L'identifiant du village associé à la classe et/ou la phase à observer sont manquants`);
    return;
  }

  const activitiesCountsByVillageClassrooms = await getDetailedActivitiesCountsByClassrooms(villageId, phase);
  res.sendJSON(activitiesCountsByVillageClassrooms);
});

statisticsController.get({ path: '/classrooms/:classroomId' }, async (req, res) => {
  const classroomId = parseInt(req.params.classroomId);
  const phase = req.query.phase ? parseInt(req.query.phase as string) : undefined;

  const filters: StatsFilterParams = { classroomId, phase };

  const minDuration = await getMinDuration(filters);
  const maxDuration = await getMaxDuration(filters);
  const averageDuration = await getAverageDuration(filters);
  const medianDuration = await getMedianDuration(filters);

  const minConnections = await getMinConnections(filters);
  const maxConnections = await getMaxConnections(filters);
  const averageConnections = await getAverageDuration(filters);
  const medianConnections = await getMedianConnections(filters);

  const childrenCodesCount = phase ? await getChildrenCodesCountForClassroom(classroomId, phase) : 0;
  const connectedFamiliesCount = phase ? await getConnectedFamiliesCountForClassroom(classroomId, phase) : 0;
  const familiesWithoutAccount = await getFamiliesWithoutAccountForClassroom(classroomId);

  const totalActivityCounts = await getTotalActivitiesCountsByClassroomId(classroomId, phase);

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
    totalActivityCounts,
  };

  res.sendJSON(response);
});

statisticsController.get({ path: '/classrooms/:classroomId/engagement-status' }, async (req, res) => {
  const classroomId = parseInt(req.params.classroomId);
  if (isNaN(classroomId)) {
    res.status(400).send(`L'identifiant de la classe est invalide.`);
    return;
  }

  const queryBuilder = AppDataSource.createQueryBuilder()
    .select('c.id', 'classroomId')
    .addSelect(
      `
        CASE
          WHEN MAX(sess.date) IS NULL OR MAX(sess.date) < (NOW() - INTERVAL 21 DAY) THEN 'ghost'
          WHEN MAX(act.publishDate) >= (NOW() - INTERVAL 21 DAY)
            OR MAX(com.createDate) >= (NOW() - INTERVAL 21 DAY) THEN 'active'
          ELSE 'observer'
        END
      `,
      'status',
    )
    .from(Classroom, 'c')
    .leftJoin(AnalyticSession, 'sess', 'sess.userId = c.userId')
    .leftJoin(Activity, 'act', 'act.userId = c.userId AND act.status = 0 AND act.deleteDate IS NULL')
    .leftJoin(Comment, 'com', 'com.userId = c.userId')
    .innerJoin(User, 'u', `u.id = c.userId`)
    .where('c.id = :classroomId', { classroomId });

  const classroomEngagementStatus = await queryBuilder.getRawOne<{
    classroomId: Classroom['id'];
    status: string;
  }>();

  res.sendJSON(classroomEngagementStatus);
});
