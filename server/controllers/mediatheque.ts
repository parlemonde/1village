import type { Filter } from '../../types/mediatheque.type';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const mediathequeController = new Controller('/mediatheque');

mediathequeController.get({ path: '/get' }, async (req, res) => {
  const filters: Filter[] = req?.body?.filters || [];
  const offset = req?.body?.offset || 0;

  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user').where('1=1');

  filters.map(({ table, column, value }) => {
    subQueryBuilder = subQueryBuilder.andWhere(`${table}.${column} = :value`, { value });
  });

  const activities = await subQueryBuilder.limit(6).offset(offset).getMany();
  res.send(activities);
});

mediathequeController.post({ path: '/post' }, async (req, res) => {
  const filters: Filter[] = req?.body?.filters || [];
  const offset = req?.body?.offset || 0;

  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user').where('1=1');

  filters.map(({ table, column, value }) => {
    subQueryBuilder = subQueryBuilder.andWhere(`${table}.${column} = :value`, { value });
  });

  const activities = await subQueryBuilder.limit(6).offset(offset).getMany();
  res.send(activities);
});

export { mediathequeController };
