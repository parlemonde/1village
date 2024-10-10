import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Video } from '../entities/video';
import { AppDataSource } from '../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

const teacherType = UserType.TEACHER;

// const classroomStatusQuery = ;

export const getClassroomsInfos = async () => {
  return await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .innerJoin('classroom.user', 'user')
    .leftJoinAndSelect('activity', 'activity', 'activity.userId = user.id') // Jointure explicite avec activity
    .select([
      'classroom.id AS classroomId',
      'classroom.name AS classroomName',
      'classroom.countryCode AS classroomCountryCode',
      'village.id AS villageId',
      'village.name AS villageName',
      'user.id AS userId',
      'user.firstname AS userFirstname',
      'user.lastname AS userLastname',
      'COUNT(activity.id) AS activityCount', // Vous pouvez ajouter les autres colonnes ici si nécessaire
      'activity.phase AS activityPhase',
      'activity.type AS activityType',
    ])
    .where('classroom.user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .groupBy('classroom.id, village.id, user.id, activity.phase, activity.type') // Ajoutez des groupements si nécessaire
    .getRawMany();
};

export const getRegisteredClassroomsCount = async (villageId: number) => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(classroom.id)', 'classroomsCount')
    .where('classroom.villageId = :villageId', { villageId })
    .getRawOne();

  return result.classroomsCount ? parseInt(result.classroomsCount, 10) : null;
};

// TODO - add phase: number | null
export const getConnectedClassroomsCount = async (villageId: number) => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(classroom.id)', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('classroom.villageId = :villageId', { villageId })
    .andWhere('user.accountRegistration = :accountRegistration', { accountRegistration: 10 })
    .getRawOne();

  return parseInt(result.classroomsCount);
};

export const getContributedClassroomsCount = async (villageId: number) => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(classroom.id)', 'classroomsCount')
    .innerJoin('classroom.activity', 'activity')
    .where('classroom.villageId = :villageId', { villageId })
    .andWhere(`COUNT(DISTINCT (activity.phase)) = :nbPhases`, { nbPhases: 3 })
    .groupBy('classroom.id')
    .getRawOne();

  return parseInt(result.classroomsCount);
};
