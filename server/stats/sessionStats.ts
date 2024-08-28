import { AnalyticSession } from '../entities/analytic';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);
const durationThreshold = 60;

export const getMinDuration = async (phase: number | null) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(DISTINCT(analytic_session.duration))', 'minDuration')
    .innerJoin('analytic_session.user', 'user')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type === :userType', { userType: UserType.TEACHER })
    .getRawOne();

  return parseInt(result.minDuration);
};

export const getMaxDuration = async (phase: number | null) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(DISTINCT(analytic_session.duration))', 'maxDuration')
    .innerJoin('analytic_session.user', 'user')
    .where('user.type === :userType', { userType: UserType.TEACHER })
    .getRawOne();

  return parseInt(result.maxDuration);
};

export const getAverageDuration = async (phase: number | null) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('ROUND(AVG(analytic_session.duration), 0)', 'averageDuration')
    .innerJoin('analytic_session.user', 'user')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type === :userType', { userType: UserType.TEACHER })
    .getRawOne();

  return parseInt(result.averageDuration);
};

export const getMedianDuration = async (phase: number | null) => {
  const durations = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('duration')
    .innerJoin('analytic_session.user', 'user')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type === :userType', { userType: UserType.TEACHER })
    .orderBy('duration', 'ASC')
    .getRawMany();

  const formatedToIntDurations = durations.map((row) => parseInt(row.duration, 10));
  const middleDurationsIndex = Math.floor(formatedToIntDurations.length / 2);

  const median =
    formatedToIntDurations.length % 2 !== 0
      ? formatedToIntDurations[middleDurationsIndex]
      : (formatedToIntDurations[middleDurationsIndex - 1] + formatedToIntDurations[middleDurationsIndex]) / 2;

  return median;
};

export const getMinConnections = async (phase: number | null) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(occurrences)', 'minConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'as').groupBy('as.uniqueId');
    }, 'subquery')
    .getRawOne();

  return result.minConnections;
};

export const getMaxConnections = async (phase: number | null) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(occurrences)', 'maxConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'as').groupBy('as.uniqueId');
    }, 'subquery')
    .getRawOne();

  return result.maxConnections;
};

export const getAverageConnections = async (phase: number | null) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('ROUND(AVG(occurrences), 0)', 'averageConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'as').groupBy('as.uniqueId');
    }, 'subquery')
    .getRawOne();

  return result.averageConnections;
};

export const getMedianConnections = async (phase: number | null) => {
  const occurrences = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(*)', 'occurrences')
    .from('analytic_session', 'analyticSession')
    .groupBy('analyticSession.uniqueId')
    .orderBy('occurrences', 'ASC')
    .getRawMany();

  const formatedToIntOccurences = occurrences.map((row) => parseInt(row.occurrences, 10));
  const middleOcurrencesIndex = Math.floor(formatedToIntOccurences.length / 2);

  const median =
    formatedToIntOccurences.length % 2 !== 0
      ? formatedToIntOccurences[middleOcurrencesIndex]
      : (formatedToIntOccurences[middleOcurrencesIndex - 1] + formatedToIntOccurences[middleOcurrencesIndex]) / 2;

  return median;
};
