import { Student } from '../entities/student';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

const userRepository = AppDataSource.getRepository(User);
const studentRepository = AppDataSource.getRepository(Student);

export const getChildrenCodesCount = async (villageId: number) => {
  const childrenCodeCount = await studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.village', 'village')
    .where('classroom.villageId = :villageId', { villageId })
    .getCount();
  return childrenCodeCount;
};

export const getFamilyAccountsCount = async (villageId: number) => {
  const familyAccountsCount = await userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village')
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id')
    .innerJoin('student', 'student', 'student.classroomId = classroom.id')
    .where('classroom.villageId = :villageId', { villageId })
    .groupBy('user.id')
    .getCount();
  return familyAccountsCount;
};

export const getConnectedFamiliesCount = async (villageId: number) => {
  const connectedFamiliesCount = await studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
    .where('classroom.villageId = :villageId', { villageId })
    .andWhere('student.numLinkedAccount >= 1')
    .getCount();

  return connectedFamiliesCount;
};
