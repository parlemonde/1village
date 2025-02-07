import { Classroom } from '../../entities/classroom';
import { AppDataSource } from '../../utils/data-source';

const classroomRepository = AppDataSource.getRepository(Classroom);

export const createFamilyAccountQuery = (villageId: number) => {
  const query = classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .innerJoin('classroom.user', 'user')
    .innerJoin('classroom.students', 'student')
    .where('user.type = :userType', { userType: 3 })
    .andWhere('village.id = :villageId', { villageId });
  return query;
};
