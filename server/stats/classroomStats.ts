import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import type { VillagePhase } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { generateEmptyFilterParams, getChildrenCodesCount, getConnectedFamiliesCount, getFamiliesWithoutAccount } from './queryStatsByFilter';

const classroomRepository = AppDataSource.getRepository(Classroom);

const teacherType = UserType.TEACHER;

// const classroomStatusQuery = ;

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
    .where('user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .getRawMany();
};

export const getRegisteredClassroomsCount = async () => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

export const getConnectedClassroomsCount = async () => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .andWhere('user.accountRegistration = :accountRegistration', { accountRegistration: 10 })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getContributedClassroomsCount = async (phase: number | null) => {
  const query = AppDataSource.createQueryBuilder()
    .select('userId')
    .from(Activity, 'activity')
    .groupBy('userId')
    .where('user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType });

export const getChildrenCodesCountForClassroom = async (classroomId: number, phase: VillagePhase) => {
  const classroom = await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .where('classroom.id = :classroomId', { classroomId })
    .getOne();

  const villageId = classroom?.villageId;

  const commentSubQuery = AppDataSource.createQueryBuilder()
    .subQuery()
    .select('userId')
    .from(Comment, 'comment')
    .where('user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .getQuery();

  const videoSubQuery = AppDataSource.createQueryBuilder()
    .subQuery()
    .select('userId')
    .from(Video, 'video')
    .where('user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .getQuery();

  const villageId = classroom?.villageId;
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId, classroomId, phase };
  return await getConnectedFamiliesCount(filterParams);
};

export const getFamiliesWithoutAccountForClassroom = async (classroomId: number) => {
  return getFamiliesWithoutAccount('classroom.id = :classroomId', { classroomId });
};
