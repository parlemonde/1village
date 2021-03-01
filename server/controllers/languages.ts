import { Request, Response } from 'express';

import { languages } from '../utils/iso-639-languages-french';

import { Controller } from './controller';

const languageController = new Controller('/languages');

//--- Get all languages ---
languageController.get({ path: '' }, async (_req: Request, res: Response) => {
  res.sendJSON(languages);
});

export { languageController };
