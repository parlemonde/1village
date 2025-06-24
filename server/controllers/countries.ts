import { UserType } from '../entities/user';
import { getCountries } from '../features/countries/countries.service';
import { Controller } from './controller';

const countryController = new Controller('/countries');

//--- Get all countries ---
countryController.get({ path: '', userType: UserType.TEACHER }, async (req, res) => {
  const hasVillage = req.query.hasVillage ? true : false;
  res.sendJSON(await getCountries(hasVillage));
});

export { countryController };
