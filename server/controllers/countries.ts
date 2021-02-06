import { Request, Response } from 'express';

import { UserType } from '../entities/user';
import { countries } from '../utils/iso-3166-countries-french';

import { Controller } from './controller';

const countryController = new Controller('/countries');

//--- Get all countries ---
countryController.get({ path: '', userType: UserType.ADMIN }, async (_req: Request, res: Response) => {
  res.sendJSON(countries);
});

export { countryController };
