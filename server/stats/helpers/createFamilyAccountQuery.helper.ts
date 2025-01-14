import { User } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

const userRepository = AppDataSource.getRepository(User);

export const createFamilyAccountQuery = async (villageId: number) => {
  const query = userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village')
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id')
    .innerJoin('student', 'student', 'student.classroomId = classroom.id')
    .where('user.type = 3')
    .andWhere('classroom.villageId = :villageId', { villageId });

  query.groupBy('user.id');
  return query;
};
