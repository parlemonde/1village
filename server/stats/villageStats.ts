import { Student } from '../entities/student';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

const userRepository = AppDataSource.getRepository(User);
const studentRepository = AppDataSource.getRepository(Student);

export const getChildrenCodesCount = async (villageId?: number) => {
  const query = studentRepository.createQueryBuilder('student').innerJoin('student.classroom', 'classroom').innerJoin('classroom.village', 'village');

  if (villageId) query.where('classroom.villageId = :villageId', { villageId });
  const childrenCodeCount = await query.getCount();
  return childrenCodeCount;
};

export const getFamilyAccountsCount = async (villageId?: number) => {
  const query = userRepository
    .createQueryBuilder('user')
    .innerJoin('user.village', 'village')
    .innerJoin('classroom', 'classroom', 'classroom.villageId = village.id')
    .innerJoin('student', 'student', 'student.classroomId = classroom.id');

  if (villageId) query.where('classroom.villageId = :villageId', { villageId });

  query.groupBy('user.id');
  const familyAccountsCount = await query.getCount();
  return familyAccountsCount;
};

export const getConnectedFamiliesCount = async (villageId?: number) => {
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
    .where('student.numLinkedAccount >= 1');
  if (villageId) query.andWhere('classroom.villageId = :villageId', { villageId });

  const connectedFamiliesCount = await query.getCount();

  return connectedFamiliesCount;
};

export const getFamiliesWithoutAccount = async (villageId?: number) => {
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.user', 'user')
    .innerJoin('user.village', 'village')
    .where('student.numLinkedAccount < 1');
  if (villageId) query.andWhere('classroom.villageId = :villageId', { villageId });

  query.select([
    'classroom.name AS classroom_name',
    'classroom.countryCode as classroom_country',
    'student.firstname AS student_firstname',
    'student.lastname AS student_lastname',
    'student.id AS student_id',
    'student.createdAt as student_creation_date',
    'village.name AS village_name',
  ]);

  const familiesWithoutAccount = query.getRawMany();
  return familiesWithoutAccount;
};

export const getFloatingAccounts = async (villageId?: number) => {
  const query = userRepository.createQueryBuilder('user').where('user.hasStudentLinked = 0').andWhere('user.type = 4');

  if (villageId) query.andWhere('user.villageId = :villageId', { villageId });

  query.select(['user.id', 'user.firstname', 'user.lastname', 'user.language', 'user.email', 'user.createdAt']);
  const floatingAccounts = query.getMany();
  return floatingAccounts;
};
