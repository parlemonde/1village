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

statisticsController.get({ path: '/general' }, async (_req, res) => {
  // contributions
  const contributions = await activityRepository
    .createQueryBuilder('activity')
    .select('activity.phase', 'phase')
    .addSelect('COUNT(DISTINCT activity.userId)', 'activeClassrooms')
    .addSelect('user.countryCode', 'countryCode')
    .innerJoin('activity.user', 'user')
    .where('user.type = :userType', { userType: UserType.TEACHER })
    .groupBy('activity.phase, user.countryCode')
    .getRawMany();

  // classroom exchanges
  const activitiesCount = await activityRepository
    .createQueryBuilder('activity')
    .select('user.countryCode', 'countryCode')
    .addSelect('activity.phase', 'phase')
    .addSelect('COUNT(activity.id)', 'totalActivities')
    .innerJoin('activity.user', 'user')
    .where('user.type = :userType', { userType: UserType.TEACHER })
    .groupBy('user.countryCode, activity.phase')
    .getRawMany();

  const commentsCount = await commentRepository
    .createQueryBuilder('comment')
    .select('user.countryCode', 'countryCode')
    .addSelect('activity.phase', 'phase')
    .addSelect('COUNT(comment.id)', 'totalComments')
    .innerJoin('comment.activity', 'activity')
    .innerJoin('comment.user', 'user')
    .where('user.type = :userType', { userType: UserType.TEACHER })
    .groupBy('user.countryCode, activity.phase')
    .getRawMany();

  const videosCount = await AppDataSource.createQueryRunner().manager.query(
    `SELECT user.countryCode, activity.phase, COUNT(*) AS total_videos 
     FROM activity
     INNER JOIN user ON activity.userId = user.id
     WHERE JSON_EXTRACT(activity.content, '$[0].type') = 'video' AND user.type = ?
     GROUP BY user.countryCode, activity.phase;`,
    [UserType.TEACHER],
  );

  const classroomExchanges = {};
  activitiesCount.forEach((activity) => {
    const key = `${activity.countryCode}-${activity.phase}`;
    if (!classroomExchanges[key]) {
      classroomExchanges[key] = {
        countryCode: activity.countryCode,
        phase: activity.phase,
        totalActivities: 0,
        totalComments: 0,
        totalVideos: 0,
      };
    }
    classroomExchanges[key].totalActivities = parseInt(activity.totalActivities);
  });

  commentsCount.forEach((comment) => {
    const key = `${comment.countryCode}-${comment.phase}`;
    if (!classroomExchanges[key]) {
      classroomExchanges[key] = {
        countryCode: comment.countryCode,
        phase: comment.phase,
        totalActivities: 0,
        totalComments: 0,
        totalVideos: 0,
      };
    }
    classroomExchanges[key].totalComments = parseInt(comment.totalComments);
  });

  videosCount.forEach((video) => {
    const key = `${video.countryCode}-${video.phase}`;
    if (!classroomExchanges[key]) {
      classroomExchanges[key] = {
        countryCode: video.countryCode,
        phase: video.phase,
        totalActivities: 0,
        totalComments: 0,
        totalVideos: 0,
      };
    }
    classroomExchanges[key].totalVideos = parseInt(video.total_videos);
  });

  // accounts
  const studentAccounts = await studentRepository
    .createQueryBuilder('student')
    .select('COUNT(*)', 'totalStudentAccounts')
    .addSelect('COUNT(DISTINCT student.classroomId)', 'classWithStudentAccounts')
    .addSelect('COUNT(DISTINCT userToStudent.userId)', 'connectedFamilies')
    .leftJoin('user_to_student', 'userToStudent', 'userToStudent.studentId = student.id')
    .getRawOne();

  // connection time
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

  const connectionTimes = {
    minDuration: baseConnectionTimesStats.minDuration,
    maxDuration: baseConnectionTimesStats.maxDuration,
    averageDuration: parseInt(baseConnectionTimesStats.averageDuration),
    medianDuration: parseInt(medianConnectionTimesStats[0].duration),
  };

  res.sendJSON({
    contributions,
    classroomExchanges: Object.values(classroomExchanges),
    studentAccounts,
    connectionTimes,
  });
});
