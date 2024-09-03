import { AnalyticSession } from '../entities/analytic';
import { Classroom } from '../entities/classroom';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);
const classroomRepository = AppDataSource.getRepository(Classroom);

export const getMinDuration = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('MIN(analytic_session.duration)', 'minDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  if (villageId) {
    queryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    queryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await queryBuilder.getRawOne();

  return result.minDuration ? parseInt(result.minDuration, 10) : null;
};

export const getMaxDuration = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('MAX(analytic_session.duration)', 'maxDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  if (villageId) {
    queryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    queryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await queryBuilder.getRawOne();

  return result.maxDuration ? parseInt(result.maxDuration, 10) : null;
};

export const getAverageDuration = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('ROUND(AVG(analytic_session.duration), 0)', 'averageDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  if (villageId) {
    queryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    queryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await queryBuilder.getRawOne();

  return result.averageDuration ? parseInt(result.averageDuration, 10) : null;
};

export const getClassroomCount = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null): Promise<number> => {
  try {
    const queryBuilder = classroomRepository.createQueryBuilder('classroom');

    if (villageId) {
      queryBuilder.andWhere('classroom.villageId = :villageId', { villageId });
    }
    if (countryCode) {
      queryBuilder.andWhere('classroom.countryCode = :countryCode', { countryCode });
    }
    if (classroomId) {
      queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
    }

    const count = await queryBuilder.getCount();
    return count;
  } catch (error) {
    console.error('Error fetching classroom count:', error);
    throw new Error('Unable to fetch classroom count.');
  }
};

// TODO - add phase: number | null
export const getMedianDuration = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('analytic_session.duration', 'duration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .where('analytic_session.duration IS NOT NULL')
    .orderBy('analytic_session.duration', 'ASC');
  if (villageId) {
    queryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    queryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const durations = await queryBuilder.getRawMany();

  if (durations.length === 0) {
    return null;
  }

  if (durations.length === 0) {
    return null; // Retourner null s'il n'y a aucune durée
  }

  const formatedToIntDurations = durations.map((row) => parseInt(row.duration, 10));
  const middleDurationsIndex = Math.floor(formatedToIntDurations.length / 2);

  const median =
    formatedToIntDurations.length % 2 !== 0
      ? formatedToIntDurations[middleDurationsIndex]
      : (formatedToIntDurations[middleDurationsIndex - 1] + formatedToIntDurations[middleDurationsIndex]) / 2;

  return median;
};

// TODO - add phase: number | null
export const getMinConnections = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId');

  if (villageId) {
    subQueryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    subQueryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    subQueryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('MIN(subquery.occurrences)', 'minConnections')
    .from(`(${subQueryBuilder.getQuery()})`, 'subquery')
    .setParameters(subQueryBuilder.getParameters())
    .getRawOne();

  if (!result || result.minConnections === null) {
    return null;
  }

  return parseInt(result.minConnections, 10);
};

export const getMaxConnections = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId');

  if (villageId) {
    subQueryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    subQueryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    subQueryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('MAX(subquery.occurrences)', 'maxConnections')
    .from(`(${subQueryBuilder.getQuery()})`, 'subquery')
    .setParameters(subQueryBuilder.getParameters())
    .getRawOne();

  if (!result || result.maxConnections === null) {
    return null;
  }

  return parseInt(result.maxConnections, 10);
};

export const getAverageConnections = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId');

  if (villageId) {
    subQueryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    subQueryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    subQueryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('AVG(subquery.occurrences)', 'averageConnections')
    .from(`(${subQueryBuilder.getQuery()})`, 'subquery')
    .setParameters(subQueryBuilder.getParameters())
    .getRawOne();

  if (!result || result.averageConnections === null) {
    return null;
  }

  return parseInt(result.averageConnections, 10);
};

// TODO - add phase: number | null
export const getMedianConnections = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId')
    .orderBy('occurrences', 'ASC');

  if (villageId) {
    subQueryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    subQueryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    subQueryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('subquery.occurrences', 'occurrences')
    .from(`(${subQueryBuilder.getQuery()})`, 'subquery')
    .setParameters(subQueryBuilder.getParameters()) // Passer les paramètres utilisés dans la sous-requête
    .getRawMany();

  // Si aucun résultat n'est trouvé, renvoyer null
  if (result.length === 0) {
    return null;
  }

  // Transformer les occurrences en un tableau d'entiers
  const occurrencesArray = result.map((row) => parseInt(row.occurrences, 10));

  // Calcul de la médiane
  const middleIndex = Math.floor(occurrencesArray.length / 2);

  const median =
    occurrencesArray.length % 2 !== 0 ? occurrencesArray[middleIndex] : (occurrencesArray[middleIndex - 1] + occurrencesArray[middleIndex]) / 2;

  return median;
};

export const getUserConnectionsList = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('analytic_session.userId', 'userId')
    .addSelect('COUNT(analytic_session.userId)', 'connections') // Count how many times each userId appears
    .groupBy('analytic_session.userId') // Group by userId to count occurrences per user
    .orderBy('connections', 'DESC') // Sort by number of connections, descending
    .getRawMany();

  return result.map((row) => ({
    userId: parseInt(row.userId, 10),
    connections: parseInt(row.connections, 10),
  }));
};
