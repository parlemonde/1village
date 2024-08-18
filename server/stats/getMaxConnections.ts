import { AnalyticSession } from '../entities/analytic';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);

export const getMaxConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(occurrences)', 'maxConnections')
    .from((subQuery) => {
      return subQuery.select('COUNT(*)', 'occurrences').from('analytic_session', 'analyticSession').groupBy('analyticSession.uniqueId');
    }, 'subquery')
    .getRawOne();

  return parseInt(result.maxConnections);
};
