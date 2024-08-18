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

  return parseInt(result.minConnections);
};
