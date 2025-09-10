import type { StatsFilterParams, WhereClause } from '../../types/statistics.type';
import { Student } from '../entities/student';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import {
  countChildrenCodes,
  countFamilyAccounts,
  countConnectedFamilies,
  countConnectedFamiliesForCountry,
  countConnectedFamiliesGlobal,
  countFamilyAccountsForCountry,
  countFamilyAccountsGlobal,
  countChildrenCodesForCountry,
  countChildrenCodesGlobal,
} from './helpers';

const studentRepository = AppDataSource.getRepository(Student);
const villageRepository = AppDataSource.getRepository(Village);
const userRepository = AppDataSource.getRepository(User);

export const getFamiliesWithoutAccount = async (condition?: string, conditionValue?: object) => {
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('student.classroom', 'classroom')
    .innerJoin('classroom.user', 'user')
    .innerJoin('user.village', 'village')
    .where('student.numLinkedAccount < 1');

  if (condition && conditionValue) {
    query.andWhere(condition, conditionValue);
  }

  query.select([
    'classroom.name AS classroom_name',
    'classroom.countryCode as classroom_country',
    'student.firstname AS student_firstname',
    'student.lastname AS student_lastname',
    'student.id AS student_id',
    'student.createdAt as student_creation_date',
    'village.name AS village_name',
  ]);

  return query.getRawMany();
};

export const getConnectedFamiliesCount = async (filterParams: StatsFilterParams) => {
  const { villageId, classroomId, countryId, phase } = filterParams;

  const getCountForVillage = async (village: Village, phase?: number, classroomId?: number) => {
    return await countConnectedFamilies(village, phase, classroomId);
  };

  if (classroomId && villageId) {
    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (village) return await getCountForVillage(village, phase, classroomId);
  }

  if (villageId) {
    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (village) return await getCountForVillage(village, phase);
  }

  if (countryId) {
    return await countConnectedFamiliesForCountry(countryId);
  }

  // global
  return await countConnectedFamiliesGlobal();
};

export const getFloatingAccounts = async (filterParams: StatsFilterParams) => {
  const { villageId, countryId } = filterParams;
  const query = userRepository.createQueryBuilder('user').where('user.hasStudentLinked = 0').andWhere('user.type = 4');

  if (villageId) query.andWhere('user.villageId = :villageId', { villageId });
  if (countryId) query.andWhere('user.countryCode = :countryId', { countryId });

  query.select(['user.id', 'user.firstname', 'user.lastname', 'user.language', 'user.email', 'user.createdAt']);
  const floatingAccounts = await query.getMany();
  return floatingAccounts;
};

export const getFamilyAccountsCount = async (filterParams: StatsFilterParams) => {
  const { villageId, countryId, phase } = filterParams;
  let familyAccountsCount = 0;

  if (villageId) {
    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (village) familyAccountsCount = await countFamilyAccounts(village, phase);
    return familyAccountsCount;
  }

  if (countryId) {
    return await countFamilyAccountsForCountry(countryId);
  }

  return await countFamilyAccountsGlobal();
};

export const getChildrenCodesCount = async (filterParams: StatsFilterParams, whereClause?: WhereClause) => {
  const { villageId, countryId, phase } = filterParams;
  let childrenCodesCount = 0;

  if (villageId) {
    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (!whereClause) whereClause = { clause: 'village.id = :villageId', value: { villageId } };
    if (village) childrenCodesCount = await countChildrenCodes(village, phase, whereClause);
    return childrenCodesCount;
  }

  if (countryId) {
    return await countChildrenCodesForCountry(countryId);
  }

  return await countChildrenCodesGlobal();
};
