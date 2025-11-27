import type { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

import type { StatsFilterParams } from '../../types/statistics.type';
import { GroupType } from '../../types/statistics.type';
import { AnalyticSession } from '../entities/analytic';
import { UserType } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);
const villageRepository = AppDataSource.getRepository(Village);

const addFiltersToQuery = (queryBuilder: SelectQueryBuilder<AnalyticSession>, params?: StatsFilterParams) => {
  const { countryId, villageId, classroomId, groupType } = params || {};

  if (villageId) {
    queryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryId) {
    queryBuilder.andWhere('user.countryCode = :countryId', { countryId });
  }

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  if (groupType !== undefined) {
    switch (groupType) {
      case GroupType.CLASSROOM:
        queryBuilder.andWhere('user.type = :userType', { userType: UserType.TEACHER });
        break;
      case GroupType.FAMILY:
        queryBuilder.andWhere('user.type = :userType', { userType: UserType.FAMILY });
        break;
      default:
    }
  }
};

export const getMinDuration = async (params?: StatsFilterParams) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('MIN(analytic_session.duration)', 'minDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  addFiltersToQuery(queryBuilder, params);

  const result = await queryBuilder.getRawOne();

  return result.minDuration ? parseInt(result.minDuration, 10) : null;
};

export const getMaxDuration = async (params?: StatsFilterParams) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('MAX(analytic_session.duration)', 'maxDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  addFiltersToQuery(queryBuilder, params);

  const result = await queryBuilder.getRawOne();

  return result.maxDuration ? parseInt(result.maxDuration, 10) : null;
};

export const getAverageDuration = async (params?: StatsFilterParams) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('ROUND(AVG(analytic_session.duration), 0)', 'averageDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  addFiltersToQuery(queryBuilder, params);

  const result = await queryBuilder.getRawOne();

  return result.averageDuration ? parseInt(result.averageDuration, 10) : null;
};

export const getRegisteredClassroomsCount = async (villageId?: number, countryCode?: string, phase?: number): Promise<number> => {
  const qb = villageRepository.createQueryBuilder('village').select('village.classroomsStats', 'classroomsStats');

  if (villageId) {
    qb.where('village.id = :villageId', { villageId });
  }

  if (phase) {
    qb.andWhere('village.activePhase = :phase', { phase });
  }

  const rows: Array<{ classroomsStats: { registeredClassrooms?: Record<string, number> } | null }> = await qb.getRawMany();

  const aggregatedClassroomCount: Record<string, number> = {};

  for (const row of rows) {
    const registeredClassrooms = row?.classroomsStats?.registeredClassrooms;

    if (registeredClassrooms) {
      for (const [code, count] of Object.entries(registeredClassrooms)) {
        const classroomCount = typeof count === 'number' ? count : parseInt(String(count), 10) || 0;
        aggregatedClassroomCount[code] = (aggregatedClassroomCount[code] || 0) + classroomCount;
      }
    }
  }

  if (countryCode) {
    return aggregatedClassroomCount[countryCode] || 0;
  }

  return Object.values(aggregatedClassroomCount).reduce((sum, n) => sum + n, 0);
};

// TODO - add phase: number | null
export const getMedianDuration = async (params?: StatsFilterParams) => {
  const queryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('analytic_session.duration', 'duration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .where('analytic_session.duration IS NOT NULL')
    .orderBy('analytic_session.duration', 'ASC');

  addFiltersToQuery(queryBuilder, params);

  const durations = await queryBuilder.getRawMany();

  if (durations.length === 0) {
    return null;
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
export const getMinConnections = async (params?: StatsFilterParams) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId');

  addFiltersToQuery(subQueryBuilder, params);

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

export const getMaxConnections = async (params?: StatsFilterParams) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId');

  addFiltersToQuery(subQueryBuilder, params);

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

export const getAverageConnections = async (params?: StatsFilterParams) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId');

  addFiltersToQuery(subQueryBuilder, params);

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
export const getMedianConnections = async (params?: StatsFilterParams) => {
  const subQueryBuilder = analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(analytic_session.id)', 'occurrences')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom')
    .groupBy('analytic_session.userId')
    .orderBy('occurrences', 'ASC');

  addFiltersToQuery(subQueryBuilder, params);

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
