import { Request, Response } from 'express';

import { currencies } from '../utils/iso-4217-currencies-french';

import { Controller } from './controller';

const currencyController = new Controller('/currencies');

//--- Get all currencies ---
currencyController.get({ path: '' }, async (_req: Request, res: Response) => {
  res.sendJSON(currencies);
});

export { currencyController };
