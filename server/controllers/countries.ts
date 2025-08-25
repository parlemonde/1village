import { getCountries } from '../features/countries/countries.service';
import { Controller } from './controller';

const countryController = new Controller('/countries');

countryController.get({ path: '' }, async (req, res) => {
  res.json(await getCountries(req.query.hasVillage === 'true'));
});

export { countryController };
