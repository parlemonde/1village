import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

export const createFamilyAccountQuery = () => {
  return classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.user', 'user')
    .innerJoin('classroom.students', 'student')
    .andWhere('user.type = :userType', { userType: 3 });
};

export const createFamilyAccountInVillageQuery = (villageId: number) => {
  return createFamilyAccountQuery().innerJoin('classroom.village', 'village').andWhere('village.id = :villageId', { villageId });
};

export const createFamilyAccountInContryQuery = (countryId: string) => {
  return createFamilyAccountQuery().andWhere('classroom.countryCode = :countryId', { countryId });
};
