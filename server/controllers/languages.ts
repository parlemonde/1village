import { Activity } from '../entities/activity';
import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { languages } from '../utils/iso-639-languages-french';
import { Controller } from './controller';

const languageController = new Controller('/languages');

type filter = {
  table: string;
  column: string;
  value: number;
};

//--- Get all languages ---
languageController.get({ path: '' }, async (_req, res) => {
  res.sendJSON(
    languages.filter((l) => {
      if (l.alpha2 !== '') {
        return l.alpha2;
      } else {
        return l.alpha3_b !== '';
      }
    }),
  );
});

languageController.get({ path: '/tests' }, async (req, res) => {
  const filters: filter[] = req?.body?.filters || [];
  const offset = req?.body?.offset || 0;

  let subQueryBuilder = AppDataSource.getRepository(Activity).createQueryBuilder('activity').innerJoin('activity.user', 'user').where('1=1');

  filters.map(({ table, column, value }) => {
    subQueryBuilder = subQueryBuilder.andWhere(`${table}.${column} = :value`, { value });
  });

  const activities = await subQueryBuilder.limit(6).offset(offset).getMany();
  res.send(activities);
});
export { languageController };
