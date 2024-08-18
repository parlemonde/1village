import { AnalyticSession } from '../entities/analytic';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);

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
