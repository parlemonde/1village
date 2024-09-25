import { Classroom } from '../entities/classroom';
import { Student } from '../entities/student';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';

const userRepository = AppDataSource.getRepository(User);
const studentRepository = AppDataSource.getRepository(Student);

export const getTeacherCreatedAccountsNumber = async (villageId: number) => {
  /* const res = await userRepository
    .createQueryBuilder('user')
    .select(['user.id AS userId'])
    .where('user.villageId = :villageId', { villageId })
    .getCount();
  return res; */
  const userCount = await userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village') // Join village associated with user
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id') // Join classroom on villageId
    .innerJoin('student', 'student', 'student.classroomId = classroom.id') // Join student on classroomId
    .getCount(); // Get count of users who have a related student
  console.log(userCount);
  return userCount;
};
