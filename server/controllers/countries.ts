import { UserType } from '../../types/user.type';
import { countries } from '../utils/iso-3166-countries-french';
import { Controller } from './controller';

const countryController = new Controller('/countries');

//--- Get all countries ---
countryController.get({ path: '', userType: UserType.TEACHER }, async (_req, res) => {
  res.sendJSON(countries);
});

export { countryController };
