import { Router } from 'express';

import { activityController } from './activity';
import { analyticController } from './analytic';
import { archiveController } from './archive';
import { audioController } from './audio';
import { classroomController } from './classroom';
import { countryController } from './countries';
import { currencyController } from './currencies';
import featureFlagController from './featureFlag';
import { gameController } from './game';
import { imageController } from './image';
import { languageController } from './languages';
import { mediathequeController } from './mediatheque';
import { notificationsController } from './notifications';
import { pelicoController } from './pelicoPresentation';
import { phaseHistoryController } from './phaseHistory';
import { statisticsController } from './statistics/statistics';
import { storyController } from './story';
import { studentController } from './student';
import { teacherController } from './teacher';
import { teamCommentController } from './teamComment';
import { userController } from './user';
import { videoController } from './video';
import { villageController } from './village';
import { weatherController } from './weather';
import { xapiController } from './xapi';

const controllerRouter = Router();

const controllers = [
  languageController,
  currencyController,
  userController,
  villageController,
  countryController,
  activityController,
  gameController,
  imageController,
  audioController,
  videoController,
  analyticController,
  archiveController,
  weatherController,
  storyController,
  xapiController,
  classroomController,
  teacherController,
  studentController,
  featureFlagController,
  statisticsController,
  teamCommentController,
  pelicoController,
  mediathequeController,
  notificationsController,
  phaseHistoryController,
];

for (const controller of controllers) {
  controllerRouter.use(controller.name, controller.router);
}

export { controllerRouter };
