import { AnalyticPerformance } from '../entities/analytic';
import { AppDataSource } from '../utils/data-source';

const analyticPerformanceRepository = AppDataSource.getRepository(AnalyticPerformance);

export const getConnections = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = analyticPerformanceRepository
    .createQueryBuilder('analytic_performance')
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
