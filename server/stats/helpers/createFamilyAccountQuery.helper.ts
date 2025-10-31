import type { VillagePhase } from '../../../types/village.type';
import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

export const createFamilyAccountQuery = (phase?: VillagePhase) => {
  const queryBuilder = classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.user', 'user')
    .innerJoin('classroom.students', 'student')
    .andWhere('user.type = :userType', { userType: 3 });

  if (phase) {
    queryBuilder.innerJoin('classroom.village', 'village').andWhere('village.activePhase = :phase', { phase });
  }

  return queryBuilder;
};

export const createFamilyAccountInVillageQuery = (villageId: number) => {
  return createFamilyAccountQuery().innerJoin('classroom.village', 'village').andWhere('village.id = :villageId', { villageId });
};

export const createFamilyAccountInCountryQuery = (countryId: string, phase: number | undefined) => {
  return createFamilyAccountQuery(phase).andWhere('classroom.countryCode = :countryId', { countryId });
};
