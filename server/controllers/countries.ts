import { Request, Response } from 'express';

import { countries } from '../utils/iso-3166-countries-french';

import { Controller } from './controller';

const countryController = new Controller('/countries');

//--- Get all countries ---
countryController.get({ path: '' }, async (_req: Request, res: Response) => {
  res.sendJSON(countries);
});

export { countryController };
