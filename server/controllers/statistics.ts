import { Activity } from '../entities/activity';
import { Comment } from '../entities/comment';
import { Student } from '../entities/student';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

const activityRepository = AppDataSource.getRepository(Activity);
const commentRepository = AppDataSource.getRepository(Comment);
const studentRepository = AppDataSource.getRepository(Student);

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

statisticsController.get({ path: '/classes-exchanges' }, async (_req, res) => {
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
