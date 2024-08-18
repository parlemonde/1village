import { AnalyticSession } from '../entities/analytic';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);

const durationThreshold = 60;

export const getMinDuration = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(DISTINCT(analytic_session.duration))', 'minDuration')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .getRawOne();

  return result.minDuration;
};

export const getMaxDuration = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(DISTINCT(analytic_session.duration))', 'maxDuration')
    .getRawOne();

  return result.maxDuration;
};

export const getAverageDuration = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('ROUND(AVG(analytic_session.duration), 0)', 'averageDuration')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .getRawOne();

  return parseInt(result.averageDuration);
};

export const getMedianDuration = async () => {
  const durations = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('duration')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
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
