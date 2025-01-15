import { User } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

const userRepository = AppDataSource.getRepository(User);

export const createFamilyAccountQuery = (villageId: number) => {
  /* const query = userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village')
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id')
    .innerJoin('student', 'student', 'student.classroomId = classroom.id')
    .addSelect('village')
    .addSelect('classroom')
    .addSelect('student')
    .where('user.type = 3')
    .andWhere('classroom.villageId = :villageId', { villageId }); */

  const query = userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.village', 'village')
    .where('user.type = :userType', { userType: 3 })
    .andWhere('village.id = :villageId', { villageId });

  return query;
};
