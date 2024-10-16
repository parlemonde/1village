import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
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
        .from(Activity, 'activity')
        .where('activity.userId = user.id')
        .groupBy('activity.phase, activity.type');
    }, 'userActivities')
    .where('user.type = :teacherType', { teacherType })
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getContributedClassroomsCount = async (phase: number | null) => {
  // TO DEBUG
  // const activitySubQuery = AppDataSource.createQueryBuilder()
  //   .select('activity.userId AS userId')
  //   .from(Activity, 'activity')
  //   .innerJoin('activity.user', 'user') // Ensure we join user
  //   .where('user.type = :teacherType', { teacherType })
  //   .groupBy('activity.userId')
  //   .having(phase ? 'COUNT(DISTINCT activity.phase) = :phase' : 'COUNT(DISTINCT activity.phase) = :nbPhases', phase ? { phase } : { nbPhases: 3 })
  //   .getQuery();
  // const commentSubQuery = AppDataSource.createQueryBuilder()
  //   .select('comment.userId AS userId')
  //   .from(Comment, 'comment')
  //   .innerJoin('comment.user', 'user') // Ensure we join user
  //   .where('user.type = :teacherType', { teacherType })
  //   .getQuery();
  // const videoSubQuery = AppDataSource.createQueryBuilder()
  //   .select('video.userId AS userId')
  //   .from(Video, 'video')
  //   .innerJoin('video.user', 'user') // Ensure we join user
  //   .where('user.type = :teacherType', { teacherType })
  //   .getQuery();
  // const result = await AppDataSource.createQueryBuilder()
  //   .select('COUNT(DISTINCT userId)', 'contributedUsersCount')
  //   .from(`(${activitySubQuery} INTERSECT ${commentSubQuery} INTERSECT ${videoSubQuery})`, 'subquery')
  //   .getRawOne();
  // return parseInt(result.contributedUsersCount);
  return 10;
};
