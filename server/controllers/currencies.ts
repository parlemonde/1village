import { UserType } from '../entities/user';
import { currencies } from '../utils/iso-4217-currencies-french';
import { Controller } from './controller';

const currencyController = new Controller('/currencies');

//--- Get all currencies ---
currencyController.get({ path: '', userType: UserType.TEACHER }, async (_req, res) => {
  res.sendJSON(currencies);
});

export { currencyController };
