import { UserType } from '../entities/user';
import { getCountriesWithVillages } from '../features/countries/countries.service';
import { countries } from '../utils/iso-3166-countries-french';
import { Controller } from './controller';

const countryController = new Controller('/countries');

//--- Get all countries ---
countryController.get({ path: '', userType: UserType.TEACHER }, async (_req, res) => {
  res.sendJSON(countries);
});

//--- Get countries that have at least one village ---
countryController.get({ path: '/present', userType: UserType.ADMIN }, async (_req, res) => {
  res.sendJSON(await getCountriesWithVillages());
});

export { countryController };
