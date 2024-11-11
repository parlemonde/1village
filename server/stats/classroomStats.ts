import { UserType } from '../../types/user.type';
import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Video } from '../entities/video';
import { AppDataSource } from '../utils/data-source';

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
export const getConnectedClassroomsCount = async (villageId?: number | null) => {
  const queryBuilder = classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(classroom.id)', 'classroomsCount')
    .innerJoin('classroom.user', 'user')
    .where('user.accountRegistration = :accountRegistration', { accountRegistration: 10 });

  // Ajouter la condition sur le villageId uniquement si ce n'est pas 0
  if (villageId) {
    queryBuilder.andWhere('classroom.villageId = :villageId', { villageId });
  }

  const result = await queryBuilder.getRawOne();

  return parseInt(result.classroomsCount, 10);
};

export const getContributedClassroomsCount = async (villageId: number) => {
  const result = await classroomRepository
    .createQueryBuilder('classroom')
    .select('COUNT(classroom.id)', 'classroomsCount')
    .innerJoin('classroom.activity', 'activity')
    .where('classroom.villageId = :villageId', { villageId })
    .andWhere(`COUNT(DISTINCT (activity.phase)) = :nbPhases`, { nbPhases: 3 })
    .groupBy('classroom.id')
    .getRawOne();

  return parseInt(result.classroomsCount);
};

export const normalizeForCountry = (inputData) => {
  const phaseMap = new Map();

  inputData.forEach(({ activities, classroomCountryCode }) => {
    activities.forEach(({ count, phase, type }) => {
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
  const allCountryCodes = Array.from(new Set(inputData.map(({ classroomCountryCode }) => classroomCountryCode)));

  // Préparer les données de sortie
  const result = Array.from(phaseMap.entries()).map(([phase, countryMap]) => ({
    phase,
    data: allCountryCodes.map((code) => {
      const countryData = countryMap.get(code) || {};

      // Inclure seulement les propriétés de type qui existent dans countryData
      const filteredData = Object.keys(countryData).reduce((acc, key) => {
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
