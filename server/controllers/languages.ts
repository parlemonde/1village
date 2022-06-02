import { UserType } from '../entities/user';
import { languages } from '../utils/iso-639-languages-french';

import { Controller } from './controller';

const languageController = new Controller('/languages');

//--- Get all languages ---
languageController.get({ path: '', userType: UserType.TEACHER }, async (_req, res) => {
  res.sendJSON(
    languages.filter((l) => {
      if (l.alpha2 !== '') {
        return l.alpha2;
      } else {
        return l.alpha3_b !== '';
      }
    }),
  );
});

export { languageController };
