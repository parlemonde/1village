import { GroupType, type StatsFilterParams } from '../../../types/statistics.type';
import { UserType } from '../../../types/user.type';
import { AnalyticSession } from '../../entities/analytic';
import { AppDataSource } from '../../utils/data-source';

export type Last12MonthDailyCountRawData = { count: number; year: number; month: number; day: number; date: string };

export const getLast12MonthDailyConnectionCounts = async (filters?: StatsFilterParams): Promise<Last12MonthDailyCountRawData[]> => {
  const query = AppDataSource.getRepository(AnalyticSession)
    .createQueryBuilder('as')
    .select('COUNT(*) as count, YEAR(as.date) as year, MONTH(as.date) as month, DAY(as.date) as day, DATE(as.date) as date')
    .groupBy('YEAR(as.date), MONTH(as.date), DAY(as.date), DATE(as.date)')
    .orderBy('DATE(as.date)', 'ASC')
    .innerJoin('user', 'user', 'as.userId = user.id');

  if (filters?.classroomId) {
    query.innerJoin('classroom', 'classroom', 'classroom.userId = user.id');
    query.andWhere('classroom.Id = :classroomId', { classroomId: filters.classroomId });
  } else if (filters?.villageId) {
    query.andWhere('user.villageId = :villageId', { villageId: filters.villageId });
  } else if (filters?.countryId) {
    query.andWhere('user.countryCode = :countryCode', { countryCode: filters.countryId });
  }

  if (filters?.phase) {
    query.andWhere('user.phase = :phase', { phase: filters.phase });
  }

  query.andWhere(filters?.groupType === GroupType.FAMILY ? 'user.type = :userType' : 'user.type != :userType', { userType: UserType.FAMILY });

  return await query.getRawMany();
};
