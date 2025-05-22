import type { StatsFilterParams, WhereClause } from '../../types/statistics.type';
import { Student } from '../entities/student';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { countChildrenCodes, countFamilyAccounts, countConnectedFamilies } from './helpers';

const studentRepository = AppDataSource.getRepository(Student);
const villageRepository = AppDataSource.getRepository(Village);
const userRepository = AppDataSource.getRepository(User);

const getVillagesFromCountryId = async (countryId: string | undefined): Promise<Village[]> => {
  if (countryId === undefined) {
    return await villageRepository.find();
  }

  return await villageRepository
    .createQueryBuilder('village')
    .where('village.countryCodes LIKE :countryId', { countryId: `%${countryId}%` })
    .getMany();
};

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

  const villages = await getVillagesFromCountryId(countryId);

  const countPromises = villages.map((vil) => getCountForVillage(vil, phase));
  const results = await Promise.all(countPromises);
  return results.reduce((total, count) => total + count, 0);
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

  const villages = await getVillagesFromCountryId(countryId);

  const countPromises = villages.map(async (vil) => {
    return countFamilyAccounts(vil, phase);
  });

  const results = (await Promise.all(countPromises)) as number[];
  familyAccountsCount = results.reduce((total, count) => total + count, 0);

  return familyAccountsCount;
};

export const getChildrenCodesCount = async (filterParams: StatsFilterParams, whereClause?: WhereClause) => {
  const { villageId, countryId, phase } = filterParams;
  let childrenCodesCount = 0;
  if (villageId) {
    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (village) childrenCodesCount = await countChildrenCodes(village, phase, whereClause);
    return childrenCodesCount;
  }

  const villages = await getVillagesFromCountryId(countryId);

  const countPromises = villages.map(async (vil) => {
    const whereClause = { clause: 'classroom.village = :villageId', value: { villageId: vil.id } };
    return await countChildrenCodes(vil, phase, whereClause);
  });
  const results = await Promise.all(countPromises);
  childrenCodesCount = results.reduce((total, count) => total + count, 0);

  return childrenCodesCount;
};
