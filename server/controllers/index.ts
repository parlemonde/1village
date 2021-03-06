import { Router } from 'express';

import { activityController } from './activity';
import { analyticController } from './analytic';
import { audioController } from './audio';
import { countryController } from './countries';
import { currencyController } from './currencies';
import { imageController } from './image';
import { languageController } from './languages';
import { userController } from './user';
import { videoController } from './video';
import { villageController } from './village';

const controllerRouter = Router();
const controllers = [
  languageController,
  currencyController,
  userController,
  villageController,
  countryController,
  activityController,
  imageController,
  audioController,
  videoController,
  analyticController,
];

for (let i = 0, n = controllers.length; i < n; i++) {
  controllerRouter.use(controllers[i].name, controllers[i].router);
}

export { controllerRouter };
