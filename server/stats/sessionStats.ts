import { AnalyticSession } from '../entities/analytic';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';

const analyticSessionRepository = AppDataSource.getRepository(AnalyticSession);
const durationThreshold = 60;
const teacherType = UserType.TEACHER;

export const getMinDuration = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .addSelect('MIN(analytic_session.duration)', 'minDuration')
    .innerJoin('analytic_session.user', 'user')
    .where('user.villageId = :villageId', { villageId })
    .getRawOne();

  return result.minDuration ? parseInt(result.minDuration, 10) : null;
};

export const getMaxDuration = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('MAX(analytic_session.duration)', 'maxDuration')
    .innerJoin('analytic_session.user', 'user')
    .where('user.villageId = :villageId', { villageId })
    .getRawOne();

  return result.maxDuration ? parseInt(result.maxDuration, 10) : null;
};

export const getAverageDuration = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('user.villageId', 'villageId')
    .select('ROUND(AVG(analytic_session.duration), 0)', 'averageDuration')
    .innerJoin('analytic_session.user', 'user')
    .where('user.villageId = :villageId', { villageId })
    .getRawOne();

  return result.averageDuration ? parseInt(result.averageDuration, 10) : null;
};

// TODO - add phase: number | null
export const getMedianDuration = async (villageId: number) => {
  const durations = await analyticSessionRepository
    .createQueryBuilder('analytic_session')
    .select('analytic_session.duration', 'duration') // Sélectionner la durée
    .innerJoin('analytic_session.user', 'user') // Joindre la table user
    .where('user.villageId = :villageId', { villageId }) // Filtrer par villageId
    .andWhere('analytic_session.duration IS NOT NULL') // S'assurer que la durée n'est pas nulle
    .orderBy('analytic_session.duration', 'ASC') // Trier par durée croissante
    .getRawMany();

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
export const getMinConnections = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('MIN(subquery.occurrences)', 'minConnections')
    .from((subQuery) => {
      return subQuery
        .select('COUNT(analytic_session.id)', 'occurrences') // Compter les occurrences de sessions analytiques par utilisateur
        .from('analytic_session', 'analytic_session')
        .innerJoin('analytic_session.user', 'user') // Joindre la table user
        .where('user.villageId = :villageId', { villageId }) // Filtrer par villageId
        .groupBy('analytic_session.userId'); // Grouper par utilisateur pour obtenir le nombre de sessions analytiques
    }, 'subquery')
    .getRawOne();

  // Si aucun résultat n'est trouvé, renvoyer null
  if (!result || result.minConnections === null) {
    return null;
  }

  return parseInt(result.minConnections, 10);
};

// TODO - add phase: number | null
export const getMaxConnections = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('MAX(subquery.occurrences)', 'maxConnections')
    .from((subQuery) => {
      return subQuery
        .select('COUNT(analytic_session.id)', 'occurrences') // Compter les occurrences de sessions analytiques par utilisateur
        .from('analytic_session', 'analytic_session')
        .innerJoin('analytic_session.user', 'user') // Joindre la table user
        .where('user.villageId = :villageId', { villageId }) // Filtrer par villageId
        .groupBy('analytic_session.userId'); // Grouper par utilisateur pour obtenir le nombre de sessions analytiques
    }, 'subquery')
    .getRawOne();

  // Si aucun résultat n'est trouvé, renvoyer null
  if (!result || result.maxConnections === null) {
    return null;
  }

  return parseInt(result.maxConnections, 10);
};

// TODO - add phase: number | null
export const getAverageConnections = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('AVG(subquery.occurrences)', 'averageConnections') // Sélectionner la moyenne des occurrences
    .from((subQuery) => {
      return subQuery
        .select('COUNT(analytic_session.id)', 'occurrences') // Compter les occurrences de sessions analytiques par utilisateur
        .from('analytic_session', 'analytic_session')
        .innerJoin('analytic_session.user', 'user') // Joindre la table user
        .where('user.villageId = :villageId', { villageId }) // Filtrer par villageId
        .groupBy('analytic_session.userId'); // Grouper par utilisateur pour obtenir le nombre de sessions analytiques
    }, 'subquery')
    .getRawOne();

  // Si aucun résultat n'est trouvé, renvoyer null
  if (!result || result.averageConnections === null) {
    return null;
  }

  return parseFloat(result.averageConnections);
};

// TODO - add phase: number | null
export const getMedianConnections = async (villageId: number) => {
  const result = await analyticSessionRepository
    .createQueryBuilder()
    .select('subquery.occurrences', 'occurrences')
    .from((subQuery) => {
      return subQuery
        .select('COUNT(analytic_session.id)', 'occurrences') // Compter les occurrences de sessions analytiques par utilisateur
        .from('analytic_session', 'analytic_session')
        .innerJoin('analytic_session.user', 'user') // Joindre la table user
        .where('user.villageId = :villageId', { villageId }) // Filtrer par villageId
        .groupBy('analytic_session.userId') // Grouper par utilisateur pour obtenir le nombre de sessions analytiques
        .orderBy('occurrences', 'ASC'); // Trier par nombre croissant d'occurrences
    }, 'subquery')
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
