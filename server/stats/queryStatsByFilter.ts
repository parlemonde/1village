import type { StatsFilterParams, WhereClause } from '../../types/statistics.type';
import { Student } from '../entities/student';
import { User } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { createFamilyAccountQuery, getPhasePeriod, phaseWasSelected } from './helpers';

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
  const query = studentRepository
    .createQueryBuilder('student')
    .innerJoin('classroom', 'classroom', 'classroom.id = student.classroomId')
    .andWhere('student.numLinkedAccount >= 1');

  if (classroomId) {
    query.andWhere('classroom.id = :classroomId', { classroomId });
  }

  if (countryId) {
    query.andWhere('classroom.countryCode = :countryId', { countryId });
  }

  if (villageId) {
    query.andWhere('classroom.villageId = :villageId', { villageId });

    if (phaseWasSelected(phase)) {
      const phaseValue = phase as number;
      const { debut, end } = await getPhasePeriod(villageId, phaseValue);
      query.andWhere('student.createdAt >= :debut', { debut });
      if (phaseValue != (await villageRepository.findOne({ where: { id: villageId } }))?.activePhase) {
        query.andWhere('student.createdAt <= :end', { end });
      }
    }
  }

  return await query.getCount();
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
    const query = await createFamilyAccountQuery(villageId, phase);
    familyAccountsCount = await query.getCount();
  } else if (countryId) {
    const villages = await villageRepository
      .createQueryBuilder('village')
      .where('village.countryCodes LIKE :countryId', { countryId: `%${countryId}%` })
      .getMany();
    const countPromises = villages.map(async (vil) => {
      const query = await createFamilyAccountQuery(vil.id, phase);
      return query.getCount();
    });

    const results = await Promise.all(countPromises);
    familyAccountsCount = results.reduce((total, count) => total + count, 0);
  }

  return familyAccountsCount;
};

export const getChildrenCodesCount = async (filterParams: StatsFilterParams, whereClause?: WhereClause) => {
  const { villageId, phase } = filterParams;
  const village = await villageRepository.findOne({ where: { id: villageId } });
  const query = studentRepository.createQueryBuilder('student').innerJoin('student.classroom', 'classroom').innerJoin('classroom.village', 'village');
  if (whereClause) query.where(whereClause.clause, whereClause.value);

  if (phaseWasSelected(phase) && villageId) {
    const phaseValue = phase as number;
    const { debut, end } = await getPhasePeriod(villageId, phaseValue);
    query.andWhere('student.createdAt >= :debut', { debut });
    if (phaseValue != village?.activePhase) query.andWhere('student.createdAt <= :end', { end });
  }

  return await query.getCount();
};
