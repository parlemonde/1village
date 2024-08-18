import { AnalyticSession } from '../entities/analytic';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);

export const getMinConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(occurrences)', 'minConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'as').groupBy('as.uniqueId');
    }, 'subquery')
    .getRawOne();

  return result.minConnections;
};

export const getMaxConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(occurrences)', 'maxConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'as').groupBy('as.uniqueId');
    }, 'subquery')
    .getRawOne();

  return result.maxConnections;
};

export const getAverageConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('ROUND(AVG(occurrences), 0)', 'averageConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'as').groupBy('as.uniqueId');
    }, 'subquery')
    .getRawOne();

  return result.averageConnections;
};

export const getMedianConnections = async () => {
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
