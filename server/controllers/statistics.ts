import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

statisticsController.get({ path: '/contributions' }, async (_req, res) => {
  const userCountsByPhase = await AppDataSource.getRepository(Activity)
    .createQueryBuilder('activity')
    .select('activity.phase', 'phase')
    .addSelect('COUNT(DISTINCT activity.userId)', 'userCount')
    .where('activity.userId IS NOT NULL')
    .groupBy('activity.phase')
    .getRawMany();
  res.sendJSON(userCountsByPhase);
});
