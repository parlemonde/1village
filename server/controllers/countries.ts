import { getCountries } from '../features/countries/countries.service';
import { Controller } from './controller';

const countryController = new Controller('/countries');

countryController.get({ path: '', userType: undefined }, async (req, res) => {
  const hasVillage = req.query.hasVillage === 'true';
  res.json(await getCountries(hasVillage));
});

export { countryController };
