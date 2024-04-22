import { UserType } from '../../types/user.type';
import { Country } from '../entities/country';
import { AppDataSource } from '../utils/data-source';
import { Controller } from './controller';

const countryController = new Controller('/countries');

//--- Get all countries ---
countryController.get({ path: '', userType: UserType.TEACHER }, async (_req, res) => {
  const countries = await AppDataSource.getRepository(Country).find();
  res.sendJSON(countries);
});

export { countryController };
