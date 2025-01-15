import type { StatsFilterParams, WhereClause } from '../../types/statistics.type';
import { Student } from '../entities/student';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import {
  createFamilyAccountQuery,
  getPhasePeriod,
  phaseWasSelected,
  createConnectedFamilyQuery,
  addPhaseFilteringToQuery,
  createChildrenCodesQuery,
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
  let connectedFamiliesCount = 0;

  if (classroomId) {
    const query = createConnectedFamilyQuery();
    query.andWhere('classroom.id = :classroomId', { classroomId });
    connectedFamiliesCount = await query.getCount();
  } else if (countryId) {
    const villages = await villageRepository
      .createQueryBuilder('village')
      .where('village.countryCodes LIKE :countryId', { countryId: `%${countryId}%` })
      .getMany();
    const countPromises = villages.map(async (vil) => {
      let query = createConnectedFamilyQuery();
      query.andWhere('classroom.villageId = :villageId', { villageId: vil.id });
      if (phase) query = await addPhaseFilteringToQuery(query, phase, vil);
      return query.getCount();
    });

    const results = await Promise.all(countPromises);
    connectedFamiliesCount = results.reduce((total, count) => total + count, 0);
  } else if (villageId) {
    const query = createConnectedFamilyQuery();
    query.andWhere('classroom.villageId = :villageId', { villageId });

    if (phaseWasSelected(phase)) {
      const phaseValue = phase as number;
      const { debut, end } = await getPhasePeriod(villageId, phaseValue);
      query.andWhere('student.createdAt >= :debut', { debut });
      if (phaseValue != (await villageRepository.findOne({ where: { id: villageId } }))?.activePhase) {
        query.andWhere('student.createdAt <= :end', { end });
      }
    }
    connectedFamiliesCount = await query.getCount();
  }

  return connectedFamiliesCount;
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

  if (villageId && phase) {
    const village = await villageRepository.findOne({ where: { id: villageId } });
    if (village) familyAccountsCount = await countFamilyAccounts(village, phase);
  } else if (countryId) {
    const villages = await villageRepository
      .createQueryBuilder('village')
      .where('village.countryCodes LIKE :countryId', { countryId: `%${countryId}%` })
      .getMany();
    const countPromises = villages.map(async (vil) => {
      return countFamilyAccounts(vil, phase);
    });

    const results = (await Promise.all(countPromises)) as number[];
    familyAccountsCount = results.reduce((total, count) => total + count, 0);
  }

  return familyAccountsCount;
};

const countFamilyAccounts = async (village: Village, phase: number | undefined) => {
  const query = createFamilyAccountQuery(village.id);
  if (village && phase) await addPhaseFilteringToQuery(query, phase, village);
  return query.getCount();
};

export const getChildrenCodesCount = async (filterParams: StatsFilterParams, whereClause?: WhereClause) => {
  const { villageId, countryId, phase } = filterParams;
  let childrenCodesCount = 0;
  if (villageId) {
    const query = createChildrenCodesQuery();
    if (whereClause) query.where(whereClause.clause, whereClause.value);
    childrenCodesCount = await query.getCount();
  } else if (countryId) {
    const villages = await villageRepository
      .createQueryBuilder('village')
      .where('village.countryCodes LIKE :countryId', { countryId: `%${countryId}%` })
      .getMany();
    const countPromises = villages.map(async (vil) => {
      let query = createChildrenCodesQuery();
      query.where('classroom.village = :villageId', { villageId: vil.id });
      if (phase) query = await addPhaseFilteringToQuery(query, phase, vil);
      return query.getCount();
    });
    const results = await Promise.all(countPromises);
    childrenCodesCount = results.reduce((total, count) => total + count, 0);
  }

  return childrenCodesCount;
};
