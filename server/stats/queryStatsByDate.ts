import { AppDataSource } from '../utils/data-source';
import { Classroom } from '../entities/classroom';

const classroomRepository = AppDataSource.getRepository(Classroom);

export const getRegisteredClassroomsCount = async (countryId?: string): Promise<number> => {
  const query = classroomRepository.createQueryBuilder('classroom').select('COUNT(DISTINCT(classroom.id))', 'classroomsCount');

  if (countryId) {
    query.where('classroom.countryCode = :countryId', { countryId });
  }
  
  const result = await query.getRawOne();
  return parseInt(result.classroomsCount);
};

export const getConnectedClassroomsCount = async (countryId?: string, sinceDate?: Date): Promise<number> => {
  const query = classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .innerJoin('user.analyticSessions', 'session')
    .where('session.startDate IS NOT NULL');

  if (countryId) {
    query.andWhere('classroom.countryCode = :countryId', { countryId });
  }

  if (sinceDate) {
    query.andWhere('session.startDate >= :sinceDate', { sinceDate });
  }

  const result = await query.getRawOne();
  return parseInt(result.classroomsCount);
};

export const getContributedClassroomsCount = async (countryId?: string, sinceDate?: Date): Promise<number> => {
  const query = classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT(classroom.id))', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .innerJoin('user.analyticSessions', 'session')
    .where('session.startDate IS NOT NULL')
    .andWhere('session.duration > 0');

  if (countryId) {
    query.andWhere('classroom.countryCode = :countryId', { countryId });
  }

  if (sinceDate) {
    query.andWhere('session.startDate >= :sinceDate', { sinceDate });
  }

  const result = await query.getRawOne();
  return parseInt(result.classroomsCount);
};
