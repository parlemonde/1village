import { Activity } from '../entities/activity';
import { AnalyticSession } from '../entities/analytic';
import { Comment } from '../entities/comment';
import { Student } from '../entities/student';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

const activityRepository = AppDataSource.getRepository(Activity);
const commentRepository = AppDataSource.getRepository(Comment);
const studentRepository = AppDataSource.getRepository(Student);
const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);

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

//penser à ajouter une condition pour ne sélectionner que les durées supérieur à 60s pour le AVG
statisticsController.get({ path: '/connection-times' }, async (_req, res) => {
  const durationThreshold = 60;

  const baseConnectionTimesStats = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(DISTINCT(duration)) AS minDuration')
    .addSelect('MAX(DISTINCT(duration)) AS maxDuration')
    .addSelect('ROUND(AVG(duration), 0) AS averageDuration')
    .where('duration >= :minDuration', { minDuration: durationThreshold })
    .getRawOne();

  const medianConnectionTimesStats = await AppDataSource.createQueryRunner().manager.query(
    `SELECT duration FROM (SELECT duration, ROW_NUMBER() OVER (ORDER BY duration) AS medianIdx FROM (SELECT DISTINCT duration FROM analytic_session WHERE duration IS NOT NULL AND duration >= ?) AS sub) AS d, (SELECT COUNT(DISTINCT duration) AS cnt FROM analytic_session WHERE duration IS NOT NULL AND duration >= ?) AS total_count WHERE d.medianIdx = (total_count.cnt DIV 2);`,
    [durationThreshold, durationThreshold],
  );

  res.sendJSON({
    minDuration: baseConnectionTimesStats.minDuration,
    maxDuration: baseConnectionTimesStats.maxDuration,
    averageDuration: parseInt(baseConnectionTimesStats.averageDuration),
    medianDuration: parseInt(medianConnectionTimesStats[0].duration),
  });
});
