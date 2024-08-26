import { getConnectedClassroomsCount, getContributedClassroomsCount, getRegisteredClassroomsCount } from '../stats/classroomStats';
import { getMinConnections, getMaxConnections, getAverageConnections, getMedianConnections } from '../stats/connectionStats';
import { getAverageDuration, getMaxDuration, getMedianDuration, getMinDuration } from '../stats/durationStats';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

statisticsController.get({ path: '/sessions' }, async (_req, res) => {
  res.sendJSON({
    minDuration: await getMinDuration(),
    maxDuration: await getMaxDuration(),
    averageDuration: await getAverageDuration(),
    medianDuration: await getMedianDuration(),
    minConnections: await getMinConnections(),
    maxConnections: await getMaxConnections(),
    averageConnections: await getAverageConnections(),
    medianConnections: await getMedianConnections(),
    registeredClassroomsCount: await getRegisteredClassroomsCount(),
    connectedClassroomsCount: await getConnectedClassroomsCount(),
    contributedClassroomsCount: await getContributedClassroomsCount(),
  });
});

//   const classroomsData = await classroomRepository
// .createQueryBuilder('classroom')
// .leftJoin('classroom.village', 'village')
// .leftJoin('classroom.user', 'user')
// .addSelect('classroom.id', 'classroomId')
// .addSelect('classroom.name', 'classroomName')
// .addSelect('classroom.countryCode', 'classroomCountryCode')
// .addSelect('village.id', 'villageId')
// .addSelect('village.name', 'villageName')
// .addSelect('user.id', 'userId')
// .addSelect('user.firstname', 'userFirstname')
// .addSelect('user.lastname', 'userLastname')
//     .addSelect(
//       `(SELECT COUNT(comment.id)
//       FROM comment
//       WHERE comment.userId = user.id) AS commentsCount`,
//     )
//     .addSelect(
//       `(SELECT COUNT(video.id)
//       FROM video
//       WHERE video.userId = user.id) AS videosCount`,
//     )
//     .addSelect(
//       `(SELECT JSON_ARRAYAGG(
//         JSON_OBJECT(
//           'phase', ac.phase,
//           'activities', ac.activities
//         )
//       )
//       FROM (
//         SELECT
//           activity.phase,
//           JSON_ARRAYAGG(
//             JSON_OBJECT(
//               'type', activity.type,
//               'count', activity.totalActivities
//             )
//           ) AS activities
//         FROM (
//           SELECT
//             activity.phase,
//             activity.type,
//             COUNT(activity.id) AS totalActivities
//           FROM activity
//           WHERE activity.userId = user.id
//             AND activity.villageId = classroom.villageId
//             AND activity.deleteDate IS NULL
//           GROUP BY activity.phase, activity.type
//         ) AS activity
//         GROUP BY activity.phase
//       ) AS ac
//     ) AS activitiesCount`,
//     )
//     .groupBy('classroom.id')
//     .addGroupBy('user.id')
//     .getRawMany();
//   res.sendJSON(
//     classroomsData.map((classroom) => ({
//       ...classroom,
//       commentsCount: parseInt(classroom.commentsCount, 10),
//       videosCount: parseInt(classroom.videosCount, 10),
//     })),
//   );
// });
// statisticsController.get({ path: '/connections' }, async (_req, res) => {
//   const durationThreshold = 60;
//   const connectionsStats = await analyticSessionRepository
//     .createQueryBuilder('analytic_session')
//     .select('MIN(DISTINCT(analytic_session.duration))', 'minDuration') // ok
//     .addSelect('COUNT(DISTINCT uniqueId)', 'connectedClassroomsCount')
//     .addSelect('(SELECT COUNT(DISTINCT id) FROM classroom)', 'registeredClassroomsCount')
//     .addSelect('(SELECT COUNT(DISTINCT userId) FROM activity)', 'contributedClassroomsCount')
//     .addSelect('MAX(DISTINCT(analytic_session.duration))', 'maxDuration') // ok
//     .addSelect('ROUND(AVG(CASE WHEN analytic_session.duration >= :minDuration THEN analytic_session.duration ELSE NULL END), 0)', 'averageDuration')
//     .addSelect(
//       `(SELECT duration FROM (SELECT duration, ROW_NUMBER() OVER (ORDER BY duration) AS medianIdx FROM (SELECT DISTINCT duration FROM analytic_session WHERE duration IS NOT NULL AND duration >= :minDuration) AS sub) AS d, (SELECT COUNT(DISTINCT duration) AS cnt FROM analytic_session WHERE duration IS NOT NULL AND duration >= :minDuration) AS total_count WHERE d.medianIdx = (total_count.cnt DIV 2))`, // ok
//       'medianDuration',
//     ) // ok
//     .addSelect('MIN(sub.occurrence_count)', 'minConnections') // ok
//     .addSelect('MAX(sub.occurrence_count)', 'maxConnections') // ok
//     .addSelect('ROUND(AVG(sub.occurrence_count), 0)', 'averageConnections') // ok
//     .addSelect(
//       `(SELECT connection_count FROM (SELECT connection_count, ROW_NUMBER() OVER (ORDER BY connection_count) AS medianIdx FROM (SELECT COUNT(*) AS connection_count FROM analytic_session GROUP BY uniqueId) AS sub) AS d, (SELECT COUNT(*) AS cnt FROM (SELECT COUNT(*) AS connection_count FROM analytic_session GROUP BY uniqueId) AS sub_count) AS total_count WHERE d.medianIdx = (total_count.cnt DIV 2))`,
//       'medianConnections',
//     ) // ok
//     .from((subQuery) => {
//       return subQuery.subQuery().select('COUNT(*)', 'occurrence_count').from(AnalyticSession, 'analytic_session').groupBy('uniqueId');
//     }, 'sub')
//     .where('analytic_session.duration >= :minDuration', { minDuration: durationThreshold })
//     .getRawOne();
//   for (const property in connectionsStats) {
//     connectionsStats[property] = typeof connectionsStats[property] === 'string' ? parseInt(connectionsStats[property]) : connectionsStats[property];
//   }
//   res.sendJSON(connectionsStats);
