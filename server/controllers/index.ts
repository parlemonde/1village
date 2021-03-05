import { Router } from 'express';

import { activityController } from './activity';
// import all controllers
import { countryController } from './countries';
import { imageController } from './image';
import { userController } from './user';
import { videoController } from './video';
import { villageController } from './village';

const controllerRouter = Router();
const controllers = [userController, villageController, countryController, activityController, imageController, videoController];

for (let i = 0, n = controllers.length; i < n; i++) {
  controllerRouter.use(controllers[i].name, controllers[i].router);
}

export { controllerRouter };
