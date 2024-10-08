import { AnalyticSession } from '../entities/analytic';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);
const durationThreshold = 60;
const teacherType = UserType.TEACHER;

// TODO - add phase: number | null
export const getMinDuration = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(DISTINCT(analytic_session.duration))', 'minDuration')
    .innerJoin('analytic_session.user', 'user')
    .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type = :teacherType', { teacherType })
    .getRawOne();

  return parseInt(result.minDuration);
};

// TODO - add phase: number | null
export const getMaxDuration = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(DISTINCT(analytic_session.duration))', 'maxDuration')
    .innerJoin('analytic_session.user', 'user')
    .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type = :teacherType', { teacherType })
    .getRawOne();

  return parseInt(result.maxDuration);
};

// TODO - add phase: number | null
export const getAverageDuration = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('ROUND(AVG(analytic_session.duration), 0)', 'averageDuration')
    .innerJoin('analytic_session.user', 'user')
    .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type = :teacherType', { teacherType })
    .getRawOne();
  return parseInt(result.averageDuration);
};

// TODO - add phase: number | null
export const getMedianDuration = async () => {
  const durations = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('analytic_session.duration', 'duration')
    .innerJoin('analytic_session.user', 'user')
    .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
    .where('analytic_session.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type = :teacherType', { teacherType })
    .orderBy('analytic_session.duration', 'ASC') // Utilisez l'alias correct pour `duration`
    .getRawMany();

  const formatedToIntDurations = durations.map((row) => parseInt(row.duration, 10));
  const middleDurationsIndex = Math.floor(formatedToIntDurations.length / 2);
  const median =
    formatedToIntDurations.length % 2 !== 0
      ? formatedToIntDurations[middleDurationsIndex]
      : (formatedToIntDurations[middleDurationsIndex - 1] + formatedToIntDurations[middleDurationsIndex]) / 2;
  return median;
};

// TODO - add phase: number | null
export const getMinConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MIN(occurrences)', 'minConnections')
    .from((subQuery) => {
      return subQuery
        .select('COUNT(*)', 'occurrences')
        .from('analytic_session', 'as')
        .innerJoin('as.user', 'user')
        .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
        .where('as.duration >= :durationThreshold', { durationThreshold })
        .andWhere('user.type = :teacherType', { teacherType })
        .groupBy('as.userId');
    }, 'subquery')
    .getRawOne();
  return parseInt(result.minConnections);
};

// TODO - add phase: number | null
export const getMaxConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('MAX(occurrences)', 'maxConnections')
    .from((subQuery) => {
      return subQuery
        .select('COUNT(*)', 'occurrences')
        .from('analytic_session', 'as')
        .innerJoin('as.user', 'user')
        .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
        .where('as.duration >= :durationThreshold', { durationThreshold })
        .andWhere('user.type = :teacherType', { teacherType })
        .groupBy('as.userId');
    }, 'subquery')
    .getRawOne();
  return parseInt(result.maxConnections);
};

// TODO - add phase: number | null
export const getAverageConnections = async () => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('ROUND(AVG(occurrences), 0)', 'averageConnections')
    .from((subQuery) => {
      return subQuery
        .select('COUNT(*)', 'occurrences')
        .from('analytic_session', 'as')
        .innerJoin('as.user', 'user')
        .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
        .where('as.duration >= :durationThreshold', { durationThreshold })
        .andWhere('user.type = :teacherType', { teacherType })
        .groupBy('as.userId');
    }, 'subquery')
    .getRawOne();
  return parseInt(result.averageConnections);
};

// TODO - add phase: number | null
export const getMedianConnections = async () => {
  const occurrences = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('COUNT(*)', 'occurrences')
    .from('analytic_session', 'as')
    .innerJoin('as.user', 'user')
    .innerJoin('Classroom', 'classroom', 'classroom.userId = user.id')
    .where('as.duration >= :durationThreshold', { durationThreshold })
    .andWhere('user.type = :teacherType', { teacherType })
    .groupBy('as.userId')
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
