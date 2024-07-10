import { Activity } from '../entities/activity';
import { AnalyticSession } from '../entities/analytic';
import { Classroom } from '../entities/classroom';
import { Comment } from '../entities/comment';
import { Student } from '../entities/student';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

const activityRepository = AppDataSource.getRepository(Activity);
const commentRepository = AppDataSource.getRepository(Comment);
const studentRepository = AppDataSource.getRepository(Student);
const classroomRepository = AppDataSource.getRepository(Classroom);
const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);

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

statisticsController.get({ path: '/connections' }, async (_req, res) => {
  const durationThreshold = 60;
  const connectionsStats = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(DISTINCT(analytic_session.duration))', 'minDuration')
    .addSelect('MAX(DISTINCT(analytic_session.duration))', 'maxDuration')
    .addSelect('ROUND(AVG(CASE WHEN analytic_session.duration >= :minDuration THEN analytic_session.duration ELSE NULL END), 0)', 'averageDuration')
    .addSelect(
      `(SELECT duration FROM (SELECT duration, ROW_NUMBER() OVER (ORDER BY duration) AS medianIdx FROM (SELECT DISTINCT duration FROM analytic_session WHERE duration IS NOT NULL AND duration >= :minDuration) AS sub) AS d, (SELECT COUNT(DISTINCT duration) AS cnt FROM analytic_session WHERE duration IS NOT NULL AND duration >= :minDuration) AS total_count WHERE d.medianIdx = (total_count.cnt DIV 2))`,
      'medianDuration',
    )
    .addSelect('MIN(sub.occurrence_count)', 'minConnections')
    .addSelect('MAX(sub.occurrence_count)', 'maxConnections')
    .addSelect('ROUND(AVG(sub.occurrence_count), 0)', 'averageConnections')
    .addSelect(
      `(SELECT connection_count FROM (SELECT connection_count, ROW_NUMBER() OVER (ORDER BY connection_count) AS medianIdx FROM (SELECT COUNT(*) AS connection_count FROM analytic_session GROUP BY uniqueId) AS sub) AS d, (SELECT COUNT(*) AS cnt FROM (SELECT COUNT(*) AS connection_count FROM analytic_session GROUP BY uniqueId) AS sub_count) AS total_count WHERE d.medianIdx = (total_count.cnt DIV 2))`,
      'medianConnections',
    )
    .from((subQuery) => {
      return subQuery.subQuery().select('COUNT(*)', 'occurrence_count').from(AnalyticSession, 'analytic_session').groupBy('uniqueId');
    }, 'sub')
    .where('analytic_session.duration >= :minDuration', { minDuration: durationThreshold })
    .getRawOne();

  for (const property in connectionsStats) {
    const statValue = connectionsStats[property];
    connectionsStats[property] = typeof statValue === 'string' ? parseInt(statValue) : statValue;
  }

  res.sendJSON(connectionsStats);
});

////////////////////////////////////////////////////// OLD ////////////////////////////////////////////////////////////

statisticsController.get({ path: '/contributions' }, async (_req, res) => {
  res.sendJSON(
    await activityRepository
      .createQueryBuilder('activity')
      .select('activity.phase', 'phase')
      .addSelect('COUNT(DISTINCT activity.userId)', 'activeClassrooms')
      .innerJoin('activity.user', 'user')
      .where('user.type = :userType', { userType: UserType.TEACHER })
      .groupBy('activity.phase')
      .getRawMany(),
  );
});

statisticsController.get({ path: '/classroom-exchanges' }, async (_req, res) => {
  const activitiesCount = await activityRepository.count({ where: { user: { type: UserType.TEACHER } } });
  const commentsCount = await commentRepository.count({ where: { user: { type: UserType.TEACHER } } });
  const videosCount = await AppDataSource.createQueryRunner().manager.query(
    `SELECT COUNT(*) AS total_videos FROM activity, 
  JSON_TABLE(activity.content, "$[*]" COLUMNS (type VARCHAR(255) PATH "$.type")) AS content_types 
  WHERE content_types.type = 'video';`,
  );

  res.sendJSON({
    totalActivities: activitiesCount,
    totalVideos: parseInt(videosCount[0].total_videos),
    totalComments: commentsCount,
  });
});

statisticsController.get({ path: '/student-accounts' }, async (_req, res) => {
  res.sendJSON(
    await studentRepository
      .createQueryBuilder('student')
      .select('COUNT(*)', 'totalStudentAccounts')
      .addSelect('COUNT(DISTINCT student.classroomId)', 'classWithStudentAccounts')
      .addSelect('COUNT(DISTINCT userToStudent.userId)', 'connectedFamilies')
      .leftJoin('user_to_student', 'userToStudent', 'userToStudent.studentId = student.id')
      .getRawOne(),
  );
});

statisticsController.get({ path: '/connection-counts' }, async (_req, res) => {
  const baseConnectionCountsStats = await analyticSessionRepository
    .createQueryBuilder()
    .select('MIN(occurrence_count)', 'minConnections')
    .addSelect('MAX(occurrence_count)', 'maxConnections')
    .addSelect('AVG(occurrence_count)', 'averageConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrence_count').from(AnalyticSession, 'analytic_session').groupBy('uniqueId');
    }, 'sub')
    .getRawOne();

  const medianConnectionCountsStats = await AppDataSource.createQueryRunner().manager.query(
    'SELECT connection_count AS medianConnections FROM (SELECT connection_count, ROW_NUMBER() OVER (ORDER BY connection_count) AS medianIdx FROM (SELECT COUNT(*) AS connection_count FROM analytic_session GROUP BY uniqueId) AS sub) AS d, (SELECT COUNT(*) AS cnt FROM (SELECT COUNT(*) AS connection_count FROM analytic_session GROUP BY uniqueId) AS sub_count) AS total_count WHERE d.medianIdx = (total_count.cnt DIV 2);',
  );

  res.sendJSON({
    minConnections: parseInt(baseConnectionCountsStats.minConnections),
    maxConnections: parseInt(baseConnectionCountsStats.maxConnections),
    averageConnections: parseInt(baseConnectionCountsStats.averageConnections),
    medianConnections: parseInt(medianConnectionCountsStats[0].medianConnections),
  });
});
