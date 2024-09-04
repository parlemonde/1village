import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Video } from '../entities/video';
import { AppDataSource } from '../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

const teacherType = UserType.TEACHER;

export const getClassroomsInfos = async () => {
  return await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .innerJoin('classroom.user', 'user')
    .select([
      'classroom.id AS classroomId',
      'classroom.name AS classroomName',
      'classroom.countryCode AS classroomCountryCode',
      'village.id AS villageId',
      'village.name AS villageName',
      'user.id AS userId',
      'user.firstname AS userFirstname',
      'user.lastname AS userLastname',
    ])
    .addSelect((subQuery) => {
      return subQuery
        .select(['COUNT(activity.id) AS count', 'activity.phase AS phase', 'activity.type AS type'])
        .from('activity', 'activity')
        .where('activity.userId = user.id')
        .groupBy('activity.phase, activity.type');
    }, 'userActivities')
    .where('user.type = :teacherType', { teacherType })
    .andWhere('user.id IS NOT NULL')
    .getRawMany();
};

export const getRegisteredClassroomsCount = async () => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user.type = :teacherType', { teacherType })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

// TODO - add phase: number | null
export const getConnectedClassroomsCount = async () => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user.type = :teacherType', { teacherType })
    .andWhere('user.accountRegistration = :accountRegistration', { accountRegistration: 10 })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

export const getContributedClassroomsCount = async (phase: number | null) => {
  const query = AppDataSource.createQueryBuilder()
    .select('userId')
    .from(Activity, 'activity')
    .groupBy('userId')
    .where('user.type = :teacherType', { teacherType });

  if (phase) query.andWhere('activity.phase = :phase', { phase });
  else query.having(`COUNT(DISTINCT activity.phase) === :nbPhases`, { nbPhases: 3 });

  const activitySubQuery = query.getQuery();

  const commentSubQuery = AppDataSource.createQueryBuilder()
    .subQuery()
    .select('userId')
    .from(Comment, 'comment')
    .where('user.type = :teacherType', { teacherType })
    .getQuery();

  const videoSubQuery = AppDataSource.createQueryBuilder()
    .subQuery()
    .select('userId')
    .from(Video, 'video')
    .where('user.type = :teacherType', { teacherType })
    .getQuery();

  const result = await AppDataSource.createQueryBuilder()
    .select('COUNT(DISTINCT(userId))', 'contributedUsersCount')
    .from(`(${activitySubQuery} INTERSECT ${commentSubQuery} INTERSECT ${videoSubQuery})`, 'contributedUsersCount')
    .setParameter('teacherType', teacherType)
    .getRawOne();

  return parseInt(result.contributedUsersCount);
};
