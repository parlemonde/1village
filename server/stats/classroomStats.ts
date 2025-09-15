import { UserType } from '../../types/user.type';
import { Classroom } from '../entities/classroom';
import type { VillagePhase } from '../entities/village';
import { AppDataSource } from '../utils/data-source';
import { generateEmptyFilterParams } from './helpers';
import { getChildrenCodesCount, getConnectedFamiliesCount, getFamiliesWithoutAccount } from './queryStatsByFilters';

const classroomRepository = AppDataSource.getRepository(Classroom);

const teacherType = UserType.TEACHER;

// const classroomStatusQuery = ;

export const getClassroomsInfos = async () => {
  return await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .innerJoin('classroom.user', 'user')
    .leftJoinAndSelect('activity', 'activity', 'activity.userId = user.id') // Jointure explicite avec activity
    .select([
      'classroom.id AS classroomId',
      'classroom.name AS classroomName',
      'classroom.countryCode AS classroomCountryCode',
      'village.id AS villageId',
      'village.name AS villageName',
      'user.id AS userId',
      'user.firstname AS userFirstname',
      'user.lastname AS userLastname',
      'COUNT(activity.id) AS activityCount', // Vous pouvez ajouter les autres colonnes ici si nécessaire
      'activity.phase AS activityPhase',
      'activity.type AS activityType',
    ])
    .where('classroom.user IS NOT NULL')
    .andWhere('user.type = :teacherType', { teacherType })
    .groupBy('classroom.id, village.id, user.id, activity.phase, activity.type') // Ajoutez des groupements si nécessaire
    .getRawMany();
};

export const getRegisteredClassroomsCount = async (villageId?: number | null) => {
  const queryBuilder = classroomRepository.createQueryBuilder('classroom').select('COUNT(classroom.id)', 'classroomsCount');

  if (villageId) {
    queryBuilder.where('classroom.villageId = :villageId', { villageId });
  }

  const result = await queryBuilder.getRawOne();

  return result.classroomsCount ? parseInt(result.classroomsCount, 10) : null;
};

// TODO - add phase: number | null
export const getConnectedClassroomsCount = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(classroom.id)', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .andWhere('user.accountRegistration = :accountRegistration', { accountRegistration: 10 });

  if (villageId) {
    queryBuilder.andWhere('classroom.villageId = :villageId', { villageId });
  }
  if (countryCode) {
    queryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }
  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await queryBuilder.getRawOne();

  return parseInt(result.classroomsCount, 10);
};

export const getContributedClassroomsCount = async (
  villageId?: number | null,
  countryCode?: string | null,
  classroomId?: number | null,
  nbPhases?: number,
) => {
  const queryBuilder = classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(DISTINCT classroom.id)', 'classroomsCount')
    .innerJoin('activity', 'activity', 'activity.classroomId = classroom.id')
    .andWhere('activity.status != :status', { status: 1 })
    .groupBy('classroom.id');

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  } else if (villageId) {
    queryBuilder.andWhere('classroom.villageId = :villageId', { villageId });
  } else if (countryCode) {
    queryBuilder.andWhere('classroom.countryCode = :countryCode', { countryCode });
  }

  if (nbPhases || nbPhases === 0) {
    if (nbPhases === 0) {
      // Condition: classroom must have at least one activity with phase 1, one with phase 2, and one with phase 3
      queryBuilder.andWhere((qb) => {
        const subQuery1 = qb.subQuery().select('1').from('activity', 'a1').where('a1.classroomId = classroom.id').andWhere('a1.phase = 1').getQuery();

        const subQuery2 = qb.subQuery().select('1').from('activity', 'a2').where('a2.classroomId = classroom.id').andWhere('a2.phase = 2').getQuery();

        const subQuery3 = qb.subQuery().select('1').from('activity', 'a3').where('a3.classroomId = classroom.id').andWhere('a3.phase = 3').getQuery();

        return `EXISTS ${subQuery1} AND EXISTS ${subQuery2} AND EXISTS ${subQuery3}`;
      });
    } else {
      queryBuilder.andWhere('activity.phase = :nbPhases', { nbPhases });
    }
  }
  const result = await queryBuilder.getCount();
  return result;
};

export const normalizeForCountry = (inputData: any) => {
  const phaseMap = new Map();

  inputData.forEach(({ activities, classroomCountryCode }: any) => {
    activities.forEach(({ count, phase, type }: any) => {
      if (!phaseMap.has(phase)) {
        phaseMap.set(phase, new Map());
      }

      const countryMap = phaseMap.get(phase);
      if (!countryMap.has(classroomCountryCode)) {
        countryMap.set(classroomCountryCode, {});
      }

      const countryData = countryMap.get(classroomCountryCode);
      countryData[`type${type}`] = (countryData[`type${type}`] || 0) + count;
    });
  });

  // Obtenez tous les codes pays uniques
  const allCountryCodes = Array.from(new Set(inputData.map(({ classroomCountryCode }: any) => classroomCountryCode)));

  // Préparer les données de sortie
  const result = Array.from(phaseMap.entries()).map(([phase, countryMap]) => ({
    phase,
    data: allCountryCodes.map((code) => {
      const countryData = countryMap.get(code) || {};

      // Inclure seulement les propriétés de type qui existent dans countryData
      const filteredData = Object.keys(countryData).reduce((acc: { [key: string]: number }, key) => {
        if (countryData[key] > 0) {
          acc[key] = countryData[key];
        }
        return acc;
      }, {});

      return { name: code, ...filteredData };
    }),
  }));

  // Ajouter la phase 3 avec des valeurs par défaut si nécessaire
  if (!result.some((item) => item.phase === 2)) {
    result.push({
      phase: 2,
      data: allCountryCodes.map((code) => ({ name: code })),
    });
  }

  if (!result.some((item) => item.phase === 3)) {
    result.push({
      phase: 3,
      data: allCountryCodes.map((code) => ({ name: code })),
    });
  }

  return result;
};

export const getChildrenCodesCountForClassroom = async (classroomId: number, phase: VillagePhase) => {
  const classroom = await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .where('classroom.id = :classroomId', { classroomId })
    .getOne();

  const villageId = classroom?.villageId;

  if (!classroomId || !villageId) return 0;
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId, classroomId, phase };
  const whereClause = { clause: 'classroom.id = :classroomId', value: { classroomId } };
  return await getChildrenCodesCount(filterParams, whereClause);
};

export const getConnectedFamiliesCountForClassroom = async (classroomId: number, phase: VillagePhase) => {
  const classroom = await classroomRepository
    .createQueryBuilder('classroom')
    .innerJoin('classroom.village', 'village')
    .where('classroom.id = :classroomId', { classroomId })
    .getOne();

  const villageId = classroom?.villageId;
  let filterParams = generateEmptyFilterParams();
  filterParams = { ...filterParams, villageId, classroomId, phase };
  return await getConnectedFamiliesCount(filterParams);
};

export const getFamiliesWithoutAccountForClassroom = async (classroomId: number) => {
  return getFamiliesWithoutAccount('classroom.id = :classroomId', { classroomId });
};

/**
 * Retourne le nombre total de classes contributrices et le détail par phase.
 */
export const getContributionsBarChartData = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const phases = [
    { step: 'Phase 1', value: 1 },
    { step: 'Phase 2', value: 2 },
    { step: 'Phase 3', value: 3 },
  ];

  // Appels parallèles pour chaque phase
  const phaseCountsPromise = phases.map((p) => getContributedClassroomsCount(villageId, countryCode, classroomId, p.value));

  // Appel pour le total (toutes phases)
  const totalPromise = getConnectedClassroomsCount(villageId, countryCode, classroomId);

  const [total, ...phaseCounts] = await Promise.all([totalPromise, ...phaseCountsPromise]);

  return {
    total,
    dataBySteps: phases.map((p, idx) => ({
      step: p.step,
      contributionCount: phaseCounts[idx],
    })),
  };
};
